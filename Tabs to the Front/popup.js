/*jslint browser: true, plusplus: true, regexp: true, white: true, unparam: true */
/*global chrome */

(function() {
	"use strict";

	/**
	 * Disable for this many ms
	 * @type Array
	 */
	var times = [
		0, // enable
		300000, // 5 * 60 * 1000
		900000, // 15 * 60 * 1000
		1800000, // 30 * 60 * 1000
		3600000, // 60 * 60 * 1000
		-1 // disable
	];

	/**
	 * Click on an anchor
	 * @param {number} ms to disable for
	 */
	function click(ms) {
		localStorage.setItem("front", ms > 0 ? Date.now() + ms : ms);
		window.close();
	}

	/**
	 * Click on the doante button
	 */
	function donate() {
		chrome.windows.create({
			"url": "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SGZD47DBBS5WY",
			"width": 800,
			"height": 840,
			"type": "popup"});
		window.close();
	}

	/**
	 * Click on the Settings button
	 */
	function options() {
		var url = {"url": chrome.extension.getURL("options.html")};

		chrome.tabs.query(url, function(tabs) {
			if (tabs.length) {
				chrome.tabs.update(tabs[0].id, {"active": true});
			} else {
				chrome.tabs.create(url);
			}
			window.close();
		});
	}

	/**
	 * Shortcut to document.querySelector - if given a number find the nth anchor
	 * @param {(number|string)} id
	 * @returns {Element}
	 */
	function find(id) {
		return document.querySelector(typeof id === "number" ? "a:nth-of-type(" + id + ")" : id);
	}

	/**
	 * Find an anchor, and bind a click handler to the length of time
	 * @param {number} id
	 * @param {number} time
	 */
	function bind(id, time) {
		find(id).addEventListener("click", click.bind(null, time));
	}

	/**
	 * Show or hide the Enable anchor
	 * @param {boolean} hidden
	 * @param {?number} index
	 */
	function enable(hidden, index) {
		var el = find(index || 2);
		if (hidden) {
			el.setAttribute("hidden", "true");
		} else {
			el.removeAttribute("hidden");
		}
	}

	/**
	 * Update the enable/disable text, setting a timeout to update if needed
	 */
	function updateText() {
		var time = parseFloat(localStorage.getItem("front") || 0),
				now = Date.now(),
				enabled = false,
				sec;
		if (time === -1) {
			find("span").textContent = chrome.i18n.getMessage("disabled");
		} else if (time > now) {
			time = Math.floor((time - now) / 1000);
			sec = time % 60;
			find("span").textContent = chrome.i18n.getMessage("disabledTime", Math.floor(time / 60) + ":" + (sec < 10 ? "0" : "") + sec);
			window.setTimeout(updateText, 1000);
		} else {
			enabled = true;
			find("span").textContent = chrome.i18n.getMessage("enabled");
		}
		enable(enabled);
	}

	/**
	 * Setup all click handlers and start the text update
	 */
	document.addEventListener("DOMContentLoaded", function() {
		var i;
		find(1).addEventListener("click", donate);
		find(8).addEventListener("click", options);
		for (i = 0; i < times.length; i++) {
			bind(i + 2, times[i]);
		}
		enable(parseFloat(localStorage.getItem("donate") || 0), 1);
		enable(parseFloat(localStorage.getItem("settings") || 0), "hr:nth-of-type(4)");
		updateText();
	});
}());