var timmy = (function() {
    return {
        init: function() {
            var data = {};
            if (localStorage.timmy == undefined) {
                data = {
                    deltas: {},
                    pages: {},
                    logs: []
                };
                localStorage.timmy = JSON.stringify(data);
            }

            // Set up page load and unload events for tracking
            var location = window.location.pathname + window.location.search;
            window.onload = pageload;
            window.onbeforeunload = pageunload;
        },
        reset: function() {
            localStorage.removeItem('timmy');
            this.init();
        },
        start: function(event) {
            var data = loadData();
            data.deltas[event] = Date.now();
            saveData(data);
        },
        end: function(event) {
            var data = loadData();
            var end = Date.now();
            var delta = end - data.deltas[event];
            var log = {
                'event': event,
                'type': 'delta',
                'start': data.deltas[event],
                'end': end,
                'delta': delta
            }
            data.logs.push(log);
            saveData(data);
            return delta;
        },
        marker: function(event) {
            var data = loadData();
            var time = Date.now();
            var marker = {
                'event': event,
                'type': 'marker',
                'marker': time
            };
            data.logs.push(marker);
            saveData(data);
            return time;
        },
        data: function(event) {
            var data = loadData();
            if (event != undefined) {
                return data.logs.filter(function(log) {
                    return log.event === event;
                });
            } else {
                return data.logs;
            }
        },
        out: function(event) {
            var data = this.data(event);
            var output = generateTable(data);

            return output;
        }
    };
    
    function loadData() {
        var data = {};

        try {
            data = JSON.parse(localStorage.timmy);
        } catch(err) {
            console.error(err);
        }

        return data;
    }

    function saveData(data) {
        try {
            localStorage.timmy = JSON.stringify(data);
        } catch(err) {
            console.error(err);
        }
    }

    function generateTable(data) {
        var table = '<div style="text-align: right; margin-bottom: 1em;"><button class="btn btn-secondary" onclick="timmy.reset()">Reset</button></div>';

        // Check that at least one element is present in data
        if (data.length > 0) {
            table += '<table>';

            table += '<thead><th>Event</th><th>Type</th><th>Start</th><th>End</th><th>Difference</th></thead>'
    
            for (var i = 0; i < data.length; ++i) {
                switch(data[i].type) {
                    case 'delta': case 'page':
                        table += generateRowDelta(data[i]);
                        break;
                    case 'marker':
                        table += generateRowMarker(data[i]);
                        break;
                }
            }

            table += '</table>';
        } else {
            console.error('Error: cannot generate a table with zero elements');
        }

        return table;
    }

    function generateRowDelta(row) {
        var start = new Date(row.start);
        var end = new Date(row.end);

        var table = '<tr>';
        table += '<td>' + row.event + '</td>';
        table += '<td>' + row.type + '</td>';
        table += '<td>' + pad(start.getHours()) + ':' + pad(start.getMinutes()) + ':' + pad(start.getSeconds()) + '.' + start.getMilliseconds() + '</td>';
        table += '<td>' + pad(end.getHours()) + ':' + pad(end.getMinutes()) + ':' + pad(end.getSeconds()) + '.' + end.getMilliseconds() + '</td>';
        table += '<td>' + (row.delta / 1000) + 's</td>';
        table += '</tr>';

        return table;
    }

    function generateRowMarker(row) {
        var start = new Date(row.marker);

        var table = '<tr>';
        table += '<td>' + row.event + '</td>';
        table += '<td>' + row.type + '</td>';
        table += '<td>' + pad(start.getHours()) + ':' + pad(start.getMinutes()) + ':' + pad(start.getSeconds()) + '.' + start.getMilliseconds() + '</td>';
        table += '<td></td>';
        table += '<td></td>';
        table += '</tr>';

        return table;
    }  
    
    function pageload(event) {
        var location = event.currentTarget.location.pathname + event.currentTarget.location.search;
        var data = loadData();
        data.pages[location] = Date.now();
        saveData(data);
    }

    function pageunload(event) {
        var location = event.currentTarget.location.pathname + event.currentTarget.location.search;
        var data = loadData();
        var end = Date.now();
        var delta = end - data.pages[location];
        var log = {
            'event': location,
            'type': 'page',
            'start': data.pages[location],
            'end': end,
            'delta': delta
        }
        data.logs.push(log);
        saveData(data);
    }

    function pad(n) {
        return String("00" + n).slice(-2);
    }
})();

timmy.init();
