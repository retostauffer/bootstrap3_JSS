$(document).ready(function() {

	// -------------------------------------------------------------------
	// Whenever we add an element with class pkp_modal_panel:
	// Check (and manipulate) a series of objects/elements.
	// -------------------------------------------------------------------
	$("body").on("DOMNodeInserted", ".pkp_modal_panel", function() {

        // Hide checkbox "sendIssueNotification" to aviod triggering
        // tens of thousands of emails to all of our users.
        var sendIssueNotification = $("#sendIssueNotification");
        $.each(sendIssueNotification, function() {
            if (!$(this).hasClass("jss_autodisabled")) {
                $(this).addClass("jss_autodisabled");
                $(this).prop("checked", false).prop("disabled", true);
                $(this).change();
                $(this).closest(".section").append("<div style=\"padding-top: 3em;\" class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\">Sending emails to all users has been automatically disabled.</div></div>");
            }
        });

		// Change default decision when a user clicks
		// "Request Revision". Change to "Revision will be subject
		// to a new review round" (text may be changed).
		var decisionResubmit = $("#decisionResubmit");
		$.each(decisionResubmit, function() {
			if (!$(this).hasClass("jss_autocheck")) {
				$(this).prop("checked", true).delay(250).queue(function() {
					$(this).change();
					$(this).addClass("jss_autocheck");
				});
			}
		});

		// Looking for element with id "skipEmail-send". Whenever found,
		// make sure it is checked (do send email; don't skip)
		// and hide closest parent div behind a text.
		var skipEmailSend = $("#skipEmail-send");
		$.each(skipEmailSend, function() {

			// Now find closest div.section
			var skipEmailDiv = $(this).closest("div.section")
			//console.log(skipEmailDiv)

			// There is no div.section? Well ... back to the keyboard, Reto
			if (skipEmailDiv.length != 1) {
				alert("Small issue setting up the form properly: Contact Reto Stauffer (Technical Editor) [error: cannot find skipEmailDiv in recommendation form]");
				return;
			}

			// Change id of the object found. Else it would be found
			// infinite times.
			$(this).attr("id", "skipEmail-send-manipulated");

			// Now do the following with it
			// - extract content
			// - remove the id from the div; add new id and class (we won't rely
			//   on the id for further manipulation in case it occurs more than
			//   once - which is should not!)
			// - add content of existing div to the new div
			var old_content = $(skipEmailDiv).html()
			var newdiv_msg = $(skipEmailDiv).empty()
				.html("<span class=\"jss_skipemail_hidden_change\">An email notification will be sent (click to change decision).</span>")
				.append("<div class=\"jss_skipemail_hidden\"></div>")
			var newdiv_content = $(newdiv_msg).find("div").html(old_content);

			// Now add interaction
			$(newdiv_msg).on("click", function() {
				$(this).find("div").show();
			});
        });

        // Similar to the code chunk above: Hiding the options
        // for selecting "Do not create a review discussion" to 
        // avoid SEs to click on it. However, there is an option
        // (as above) to change this decision if needed.
		var skipDiscussionSend = $("#skipDiscussion-send");
		$.each(skipDiscussionSend, function() {

			// Now find closest div.section
			var skipDiscussionDiv = $(this).closest("div.section")
			console.log(skipDiscussionDiv)

			// There is no div.section? Well ... back to the keyboard, Reto
			if (skipDiscussionDiv.length != 1) {
				alert("Small issue setting up the form properly: Contact Reto Stauffer (Technical Editor) [error: Cannot find skipDiscussionDiv in recommendation form]");
				return;
			}

			// Change id of the object found. Else it would be found
			// infinite times.
			$(this).attr("id", "skipDiscussion-send-manipulated");

			// Now do the following with it
			// - extract content
			// - remove the id from the div; add new id and class (we won't rely
			//   on the id for further manipulation in case it occurs more than
			//   once - which is should not!)
			// - add content of existing div to the new div
			var old_content = $(skipDiscussionDiv).html();
			var newdiv_msg = $(skipDiscussionDiv).empty()
				.html("<span class=\"jss_skipdiscussion_hidden_change\">A review discussion will be started (click to change decision).</span>")
				.append("<div class=\"jss_skipdiscussion_hidden\"></div>");

			var newdiv_content = $(newdiv_msg).find("div").html(old_content);
            $(newdiv_msg).find("div").prepend("<label>Start discussion with journal editor(s)</label></div>");

			// Now add interaction
			$(newdiv_msg).on("click", function() {
				$(this).find("div").show();
			});
        });


		// The 'Add discussion' form takes quite a while to load and
		// some users might click 'close' too ealry (resulting in an empty
		// discussion). Thus, if we find the 'Add discussion' header div
		// we modify the input.
		//
		// The element we are interested in is (XPath):
		// - //div[contains(@class, "pkp_modal_panel")]/div[@class = "header"]
		// ... we are already in the ".pkp_modal_panel" has been added to the
		// DOM, we now try to identify the element and change it if needed.
		console.log("Looking for divs")
		var adtitle = $("div.pkp_modal_panel > div.header");
		console.log(adtitle.length)
		var title_to_find = "Add discussion"
		$.each(adtitle, function() {
			if ($(this).html() == title_to_find) {
				$(this).html(title_to_find + "<div class=\"jss_subtitle\">Please wait while form is loading.</div>");
			}
		});


	});


	// -------------------------------------------------------------------
	// Adding a note on the form which initializes new review rounds.
	// 2021-10-17, Reto.
	// -------------------------------------------------------------------
	$("body").on("DOMNodeInserted", "#addParticipantForm", function() {
		var elem = $("select[id*='filterUserGroupIdgrid-users-userselect']")
		if (elem.length == 1) {
			var cls = "jss_production_editor_autoselector";
			if (!$(elem).hasClass(cls)) {
				// First of all add class to prevent being executed once more.
				$(elem).addClass(cls);
				// Now adding a 'live' event handler
				$(elem).on("change", function() {
					var selected = $(this).find("option:selected");
					var selected_text = $(selected).text();
					// If the user selects 'Production editor'
					// we will check if we have a template called
					// PRODUCTION_EDITOR_ASSIGNED which is one of our
					// custom email templates. If so, we auto-select it
					// and trigger a change which will replace the message
					// body text with our template automatically.
					if (selected_text.toLowerCase() == "production editor") {
						var templates = $("#notifyFormArea select#template");
						var tmp = $(templates).find("option[value = 'PRODUCTION_EDITOR_ASSIGNED']");
						if (tmp.length == 1) {
						    $(templates).val("PRODUCTION_EDITOR_ASSIGNED").trigger("change");
						}
					}
				});
			}
		}
	});


	// -------------------------------------------------------------------
	// Adding a note on the form which initializes new review rounds.
	// 2021-10-17, Reto.
	// -------------------------------------------------------------------
	$("body").on("DOMNodeInserted", "#newRoundForm", function() {
		var elem = $("form#newRoundForm")
		if (elem.length == 1) {
			var jss_note = $(elem).closest("div.content").find(".jss_notification > .notifyInfo")
			if (jss_note.length == 0) {
				$(elem).before("<div class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\" style=\"margin-bottom: 0;\"></div></div>");
				var tmp = $(elem).closest("div.content").find(".jss_notification .notifyInfo")
				$(tmp).html("<strong>Important:</strong><br />" +
					    "Do <strong>not start a new review</strong> round immediately after requesting revision!<br />" +
					    "A new round is initialized <strong>once the authors have uploaded all revisions</strong> and the material is ready for a new review round. " +
					    "See section 'Revisions' in our <a href=\"/guides/editors\" target=\"_new\">Editorial guide</a>.")
			}
		}
	});


	// -------------------------------------------------------------------
	// Manipulate the 'send reviews' form when clicking "Request Revision".
	//
	// Compared to default OSJ3 we automatically add the reviews to the
	// email template by programmatically clicking (and then hiding) the
	// "Add reviews to email" button and auto-check all attachments.
	// A note will be shown if successful. Else we do not touch the
	// form at all not to break functionality.
	// -------------------------------------------------------------------
	$("body").on("DOMNodeInserted", "#sendReviews", function() {
		// We need several elements in place as we modify them
		// at the same time. This is:
		// - "div.section > a#importPeerReviews": the "+ Add Review to email" button
		// - a "table" with an id containing "component-grid-files-attachment-editorselectablereviewattachmentsgrid";
		//   Note that the id also contains a randomly generated part; thus we must use :contains
		// - div.jss_notification: if already there we have added it already and don't want to do it again
		// If both are available we:
		// - Add a new 'div' element with class 'jss_notification' (see below),
		// - Press the button a#importPeerReviews (adds reviews to email textarea)
		//   and add a note to the div.jss_notification thing
		// - Auto-check all attachment files and also drop a note to
		//   the div.jss_notification thing
		//
		// If anything goes wrong we just don't do anything to avoid to break OJS3 functionality
		var a_import    = $(this).find("div.section > a#importPeerReviews");
		var files_table = $(this).find("table[id*='component-grid-files-attachment-editorselectablereviewattachmentsgrid']");
		var jss_note    = $(this).find("div.jss_notification");
		if ($(a_import).length == 1 * $(files_table).length == 1 & $(jss_note).length == 0) {
			// First, add the div.jss_notification to prevent to trigger this again
			$(a_import).closest("div.section")
					.before("<div class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\" style=\"margin-bottom: 0;\"></div></div>");
			var tmp = $("#sendReviews div.jss_notification > div.notifyInfo");
			$(tmp).html("<b>Note for the editor:</b>"); // Temporary content

			// Now let us press the link a_import
			$(a_import).hide();
			setTimeout(function() {
				$(a_import).click();
				$(tmp).append("<br/> All review text fields have been included in the e-mail above. Please check that everything is in order.");
			}, 1000);

			// Check all attachment checkboxes
			var boxes = $(files_table).find("input[type='checkbox'][name*='selectedAttachments']");
			var counter = 0;
			$.each(boxes, function() {
				$(this).prop("checked", true);
				counter = counter + 1;
			});
			$(tmp).append("<br />All " + counter + " review file have been selected below as attachments to the e-mail. Please check and deselect if needed.");

			// Adding additional functionality. When changing the decision
			// radio button the email template is getting replaced and the
			// textual reviews are getting deleted. Thus, we have to press
			// the (now hidden) button again (a_import from above; variable
			// still exists).
			$("input[name = 'decision']").on("change", function(x) {
				setTimeout(function() {
					$(a_import).click()
					$(tmp).append("<br />Decision/email template changed, textual reviews added again.")
				}, 1000)
			})
		}


	});

	// -------------------------------------------------------------------
	// When adding a reviewer we can select a 'review form'.
	// The default here is 'free form'.
	// This quick hack here searches for the #reviewFromId, extracts
	// all options and selectes the last one. This last one is the
	// one last in order when you go to  Workflow > Review > Forms (can
	// be re-ordered if needed).
	// -------------------------------------------------------------------
	$("body").on("DOMNodeInserted", "#regularReviewerForm", function() {

		var selectBox = $("select#reviewFormId");
		$.each(selectBox, function() {
			if (! $(this).hasClass("jss_changed_default")) {
				$(this).addClass("jss_changed_default")
				// Search for all select options and auto-select
				// the last entry.
				var lastOpt = $(this).find("option").last();
				$(this).val($(lastOpt).val());
			}
		});

	});

	// -------------------------------------------------------------------
	// Replace a-content (text of link) when we find a hyperref containing "Round&nbsp;1".
	// Executed every time a #reviewTabs element is added to the DOM.
	// \u00a0 is just &nbsp; in unicode
	// -------------------------------------------------------------------
	$("body").on("DOMNodeInserted", "#reviewTabs", function() {
		var a = $("#reviewTabs ul[role = 'tablist'] > li[role = 'tab'] a:contains('Round\u00a01')")
		$.each(a, function() {
			if ($(this).text() != "Round\u00a01") return
			$(this).html("Round\u00a01\u00a0(prescreening)"); 
		});
	});
	// ... schiache Kopie, aber muss erst mal rennen (Reto&Max)
	$("body").on("DOMNodeInserted", "#externalReviewRoundTabs", function() {
		var a = $("#externalReviewRoundTabs ul[role = 'tablist'] > li[role = 'tab'] a:contains('Round\u00a01')")
		$.each(a, function() {
			if ($(this).text() != "Round\u00a01") return
			$(this).html("Round\u00a01\u00a0(prescreening)"); 
		});
	});

	// -------------------------------------------------------------------
	// -------------------------------------------------------------------
	// If a div with a label with content "Prefix" is added
	// - make sure the content is only the word Prefix (nothing else)
	// - hide the parent div.
	$("body").on("DOMNodeInserted", "#submitStep3Form", function() {
		// Find 'label' which contains 'Prefix'. If found, hide parent div
		var title_prefix = $(this).find("label:contains('Prefix'):not(.jss-js-hidden-element)");
		$.each(title_prefix, function() {
			// Make sure it solely contains this single word
			if ($(this).text() == "Prefix") {
				$(this).addClass("jss-js-hidden-element");
				$(this).parent("div.section").hide();
			}
		});
		//// Find label with content 'Subtitle'. If found, hide parent div
		var title_subtitle = $(this).find("label:contains('Subtitle'):not(.jss-js-hidden-element)");
		$.each(title_subtitle, function() {
			// Make sure it solely contains this single word
			if ($(this).text() == "Subtitle") {
				$(this).addClass("jss-js-hidden-element");
				$(this).parent("div").hide();
			}
		});
		//// Last find title and adjust
		var title_title = $(this).find("label:contains('Title'):not(.jss-js-modified-css)");
		$.each(title_title, function() {
			// Make sure it solely contains this single word
			$(this).addClass("jss-js-modified-css");
			$(this).parent("div").css("width", "100%").css("padding-bottom", "1em");
		});
	});

}); // End on document ready
