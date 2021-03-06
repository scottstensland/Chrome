/*jslint browser: true, plusplus: true, regexp: true, white: true, unparam: true */
/*global chrome */
/**
 * Translate anything that needs it...
 */
document.addEventListener("DOMContentLoaded", function() {
	"use strict";
	var i, attr = "data-i18n", elements = document.querySelectorAll("[" + attr + "]");
	for (i = 0; i < elements.length; i++) {
		elements[i].innerHTML = chrome.i18n.getMessage(elements[i].getAttribute(attr));
	}
});