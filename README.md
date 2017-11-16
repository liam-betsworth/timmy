# Timmy.js

A Javascript library that keeps track of time for individual pages and user journeys. Logs are stored in localstorage and can be visualised using simple pre-built functions.

> “TIMMEH!!!”
> – <cite>An enthusiastic fan of Timmy.js</cite>


## Background

We‘re strong believers that a good user experience should not be driven by the time it takes to complete a service or transaction.

However, there are some situations where efficiency is a key design driver. In these instances, it‘s important to understand the impact that design decisions have on the speed of completing a transaction or service.

This library was built to aid user research activities, tracking the timings of particular pages and user journeys.

## How to use it

### Include the library

```
<script src="timmy.js"></script>
```

### Recording times
#### Adding a marker

You can add an individual marker at any time by calling the `marker` function:

```
timmy.marker("Clicked button"); // Returns the timestamp
<- 1510846581293
```

This will record the name of the event and the time that it was triggered. Markers act as isolated timings.

#### Timing a page

By default, Timmy.js will track the length of time a user spends on a particular web page.

For reference, timings begin when `window.onload` is triggered and end when `window.beforeunload` is called.

#### Timing a journey

To time a user journey, you must choose when the journey begins and ends. You can do this using the `start` and `end` functions:

```
timmy.start("addUser");

…

timmy.end("addUser"); // Returns the timestamp
<- 1510846587564
```

This will record when the journey started and ended, giving a total completion time. Starting the journey multiple times will reset the timer.

### Reset timings

To reset all timings and logs, call the `reset` function:

```
    timmy.reset();
```

### Output

#### Preformatted output

To get all data in a preformatted output, use the `out` function.

```
jimmy.out();
<- '<table>…</table>'
```

`Out` has an optional parameter `event`, which is the name of the event you would like to filter by. This allows the you to seperate preformatted output:

```
jimmy.out("addUser");
<- '<table>…</table>'
```

#### Raw log data

To get the raw log data, use the `data` function:

```
jimmy.data();
<- [{…},{…},{…}]
```

Similar to `out`, `data` also has the optional parameter `event`, which allows you to filter which data is returned by event name.

```
jimmy.data('/search');
<- [{…},{…}]
```

### Examples

#### Outputting logs with jQuery

```
<html>
    <body>
        <div id="logs"></div>
    </body>

    <script>
        $('#logs').html(timmy.out());
    <script>
</html>
```