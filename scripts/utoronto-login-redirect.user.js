// ==UserScript==
// @name         UofT ACORN Login Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-fill login credentials and redirect to the ACORN course page.
// @author       You
// @match        https://idpz.utorauth.utoronto.ca/idp/profile/SAML2/Redirect/SSO*
// @match        https://acorn.utoronto.ca/sws/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Replace these placeholders with your own credentials locally.
    // Never commit real credentials to GitHub.
    let username = "YOUR_USERNAME",
        password = "YOUR_PASSWORD";

    // If the login submit button is present, we assume we are on the UofT SSO page.
    let btn = document.querySelector("button[name='_eventId_proceed']");
    if (btn) {
        document.querySelector("#username").value = username;
        document.querySelector("#password").value = password;
        btn.click();
    }

    // After successful login, redirect from the ACORN landing page to the course page.
    if (window.location.href === "https://acorn.utoronto.ca/sws/#/") {
        window.location.href = "https://acorn.utoronto.ca/sws/#/courses/0";
    }
})();
