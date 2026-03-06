// ==UserScript==
// @name         UofT ACORN Auto Enrol
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open one worker window per course and repeatedly try to click Enrol.
// @author       You
// @match        https://acorn.utoronto.ca/sws/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const preferredCourses = [
        "CSC148H1",
        "ECO101H1",
        "MAT135H1",
        "MAT223H1",
        "STA130H1",
    ],
    THINK_TIME = 3000,
    MAX_REPEAT = 2,
    BASE_URL = "https://acorn.utoronto.ca/sws/#/courses/0";

    function render() {
        console.info("Rendering helper button");
        let div = document.createElement("div");

        div.innerHTML = `<div style="position: fixed; top: 60px; right: 0; background-color: red; z-index: 99999;">
    <button id="GOGOGO">GOGOGO</button>
    </div>`;
        document.body.appendChild(div);

        console.info("Attaching click handler");
        document.querySelector("#GOGOGO").onclick = function() {
            console.info("Opening one worker window per course");
            for (let courseId of preferredCourses) {
                window.open(BASE_URL + "?_=" + courseId);
            }
        };
    }

    // Perform enrolment flow for one course.
    function enrolWorker(courseId) {
        console.info("Waiting for the course card to load: " + courseId);
        waitForElement("#" + courseId + "-planCourseBox", function(courseBox) {
            console.info("Opening course details");
            courseBox.querySelector(".updateEnrolment").click();
        });

        console.info("Waiting for enrol button: " + courseId);
        waitForElement("#enrolFromPlan", function(enrolBtn) {
            console.info("Removing disabled class");
            enrolBtn.className = enrolBtn.className.replace("disabled", "");
            let p = sleep(0);
            for (let i = 0; i < MAX_REPEAT; i++) {
                p = p.then(() => {
                    return new Promise((resolve) => waitForElement("#enrolFromPlan", resolve));
                })
                .then(btn => btn.click())
                .then(() => {
                    console.info("Waiting between clicks to simulate human pacing");
                    return sleep(THINK_TIME);
                });
            }
        });
    }

    function sleep(t) {
        return new Promise(r => setTimeout(r, t));
    }

    function waitForElement(elSelector, callback) {
        console.info("Waiting for element: " + elSelector);
        let rendered = setInterval(function() {
            let el = document.querySelector(elSelector);
            if (el) {
                console.log("Element found");
                clearInterval(rendered);
                callback(el);
            }
        }, 100);
    }

    function main() {
        if (window.location.href === BASE_URL) {
            render();
        } else if (window.location.href.startsWith(BASE_URL + "?_=")) {
            let courseId = window.location.href.substr((BASE_URL + "?_=").length);
            enrolWorker(courseId);
        }
    }

    main();
})();
