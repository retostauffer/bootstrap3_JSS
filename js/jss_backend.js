// -------------------------------------------------------------------
// This is our backend JS script which uses a MutationObserver
// to check every new node added. For each node a series of
// functions are executed to manipulate a few elements here
// and there.
//
// Check the last 20-ish lines of the code to see what is done,
// the rest is just a series of function definitions.
// -------------------------------------------------------------------


// -------------------------------------------------------------------
// Whenever a form is added we check if it has a skipEmail or
// skipDiscussion option. If so, we 'hide' that selection from the
// user with an info text (can be changed).
//
// Record recommendation: has both skipEmail and skipDiscussion
// Record decision: has skipEmail
// ... not sure where else it occurs (if even).
// -------------------------------------------------------------------
const func_forms_skipEmail_and_skipDiscussion = function(x) {
	if ($(x).is("form")) {
		// Looking for element with id "skipEmail-send". Whenever found,
		// make sure it is checked (do send email; don't skip) and hide
		// closest parent div behind a text.
		var skipEmailDivs = $(x).find(".section:has(#skipEmail-send)");
		$.each(skipEmailDivs, function() {
			// Now do the following with it
			// - extract content
			// - remove the id from the div; add new id and class (we won't rely
			//   on the id for further manipulation in case it occurs more than
			//   once - which is should not!)
			// - add content of existing div to the new div
			var old_content = $(this).html()
			var newdiv_msg = $(this).empty()
				.html("<span class=\"jss_skipemail_hidden_change\">An email notification will be sent (click to change decision).</span>")
				.append("<div class=\"jss_skipemail_hidden\"></div>")
			var newdiv_content = $(newdiv_msg).find("div").html(old_content);

			// Now add interaction
			$(newdiv_msg).on("click", function() { $(this).find("div").show(); });
		}); // end skip email

		// Similar to the code chunk above: Hiding the options for
		// selecting "Do not create a review discussion" to avoid SEs to
		// click on it. However, there is an option (as above) to change
		// this decision if needed.
		var skipDiscussionDivs = $(".section:has(#skipDiscussion-send)");
		$.each(skipDiscussionDivs, function() {
			// Now do the following with it
			// - extract content
			// - remove the id from the div; add new id and class (we won't rely
			//   on the id for further manipulation in case it occurs more than
			//   once - which is should not!)
			// - add content of existing div to the new div
			var old_content = $(this).html();
			var newdiv_msg = $(this).empty()
				.html("<span class=\"jss_skipdiscussion_hidden_change\">A review discussion will be started (click to change decision).</span>")
				.append("<div class=\"jss_skipdiscussion_hidden\"></div>");

			var newdiv_content = $(newdiv_msg).find("div").html(old_content);
			$(newdiv_msg).find("div").prepend("<label>Start discussion with journal editor(s)</label></div>");

			// Now add interaction
			$(newdiv_msg).on("click", function() { $(this).find("div").show(); });
		}); // end skip discussion
	}
}

// -------------------------------------------------------------------
// When adding a production editor, trying to automatically change
// the email template to 'add production editor'.
// -------------------------------------------------------------------
const func_assign_participant_form = function(x) {
	if ($(x).is("#addParticipantForm")) {
		// Adding live event handler
		$(x).on("change", function() {
			var selected = $(this).find("option:selected");
			var selected_text = $(selected).text();
			// If the user selects 'Production editor' we will check if we
			// have a template called PRODUCTION_EDITOR_ASSIGNED which is
			// one of our custom email templates. If so, we auto-select it
			// and trigger a change which will replace the message body
			// text with our template automatically.
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

// -------------------------------------------------------------------
// Adding a note on the form which initializes new review rounds.
// -------------------------------------------------------------------
const func_start_new_review_round = function(x) {
	if ($(x).is("#newRoundForm")) {
		$(x).before("<div class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\" style=\"margin-bottom: 0;\">" +
					"<strong>Important:</strong><br/>" +
					"Do <strong>not start a new review</strong> round immediately after requesting revision!<br/>" +
					"A new round is initialized <strong>once the authors have uploaded all revisions</strong> and the material is ready for a new review round. " +
					"See section 'Revisions' in our <a href=\"/guides/editors\" target=\"_new\">Editorial guide</a>." +
					"</div></div>");
	}
}

// -------------------------------------------------------------------
// The 'Add discussion' form can take some time to be loaded.
// If the user clicks somewhere else (closes) early, an empty discussion
// is started which helps no one. Thus, we show a quick note.
// -------------------------------------------------------------------
const func_start_discussion_wait = function(x) {
	if ($(x).is(".pkp_modal")) {
		let div = $(x).find(".pkp_modal_panel > .header:contains('Add discussion')");
		$(div).html($(div).text() + "<div class=\"jss_subtitle\">Please wait while form is loading.</div>");
	}
};

// -------------------------------------------------------------------
// Modify the form when an editor clicks "Request revision".
// There are a few bits and bobs going on inside (see comments).
// - #promote (accept)
// - #sendReviews (review, decline)
// -------------------------------------------------------------------
const func_decision_option_and_include_review = function(x) {
	if ($(x).is("#sendReviews") || $(x).is("#promote")) {

		// If the article has reviews ther is a button "+ Add Reviews to Email".
		// We do auto-click this button.
		let add = $(x).find("#sendReviews-emailContent div:has(a#importPeerReviews)");
		// If anything is to add, we add it now
		if (add.length) {

			// JSS notification box
			$(add).before("<div class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\" style=\"margin-bottom: 0;\">" +
							"<strong>Note for the editor:</strong></div></div>");
			let note = $(x).find(".jss_notification .notifyInfo");

			// Now let us press the link a_import
			let add_link = $(add).find("#importPeerReviews")

			// Trigger initial change of
			setTimeout(function() {
				$(note).append("<br/>All review text fields have been included in the e-mail above. Please check that everything is in order.");
				$(add_link).click().hide();
				$(document).data("jss_reviews_added", true); // store flag such that we do not add the reviews twice when this function runs
			}, 1000);

			// Adding additional functionality. When changing the decision
			// radio button the email template is getting replaced and the
			// textual reviews are getting deleted. Thus, we have to press
			// the (now hidden) button again (a_import from above; variable
			// still exists).
			$("input[name = 'decision']").on("change", function(x) {
				setTimeout(function() {
					if (!$(document).data("jss_reviews_added")) {
						$(add_link).click();
						$(note).append("<br/>E-mail template changed, review text fields have been added again (check if everythign is fine).")
					}
					$(document).data("jss_reviews_added", false);
				}, 1000)
			})

		}

		// Find 'decisionResubmit' option and change the selected option
		// from 'Conditionally accepted' to 'Revisions will be subject to another review round'.
		// This also triggers the live action above, thus adding the review text fields to the email
		// -- this is only applied if $(x).is("#sendReviews"), for $(x).is("#promote") it has no effect
		let input = $(x).find("#decisionResubmit");
		$(input).prop("checked", true).delay(250).queue(function() {
			$(this).change();
		});
	}
}

// -------------------------------------------------------------------
// Automatically select all files in "Select review files to share with the authors"
// automatically and append a note for the editor.
// -------------------------------------------------------------------
const func_decision_revision_attachments = function(x) {
	if ($(x).is("div[id*='component-grid-files-attachment-editorselectablereviewattachmentsgrid']")) {
		let checkboxes = $(x).find("table input[type='checkbox'][name*='selectedAttachments']");
		if (checkboxes.length) {
			// JSS notification box, will be extended later
			$(x).before("<div class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\" style=\"margin-bottom: 0;\"><strong>Note for the editor:</strong><br/>" +
					"All " + checkboxes.length + " files below have been selected to be shared with the authors. Can be deselected if needed.</div></div>");
			$.each(checkboxes, function() { $(this).prop("checked", true); });
		}
	}
}

// -------------------------------------------------------------------
// In the past we disabled the option to send issue notification when a new
// issue is getting published, this was a safety measure in the past where
// we had 120.000+ bot registrations, but we may be able to do it now with
// 5000 users? Thus, I'll just add a note for now.
// -------------------------------------------------------------------
const func_send_issue_notification = function(x) {
	if ($(x).is("#assignPublicIdentifierForm")) {
		let ul = $(x).find("ul:has(li > label > #sendIssueNotification)")
		if ($(ul).length) {
			$(ul).find("input").prop("checked", false);
			$(ul).before("<div style=\"padding-top: 0;\" class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\">" +
					"The 'Send Email' option has been automatically disabled. In the past, we even " +
					"hid this feature due to the presence of 120,000 bot accounts. However, with the " +
					"user count now below 6000, we could reconsider sending notifications again?</div></div>");
		}
	}
}

// -------------------------------------------------------------------
// When adding a reviewer a form with the id #regularReviewerForm
// is added with a dropdown menu to select the 'Review Form'.
// The default is a free form, we set it to the last option
// (Review Form (v2.1)).
//
// Note that the node #advancedReviewerSearch is added and found by
// the MutationObserver, thus we need the .find method.
// Wishlist: Not just take the last option but be more specific? Needed?
// -------------------------------------------------------------------
const func_add_reviewer_regularReviewerForm = function(x) {
	if ($(x).is("#advancedReviewerSearch")) {
		let target = $(x).find("#regularReviewerForm");
		if ($(target).length) {
			let selectBox = $("select#reviewFormId");
			let lastOpt = $(selectBox).find("option").last();
			$(selectBox).val($(lastOpt).val());
		}
	}
}

// -------------------------------------------------------------------
// Renaming li > a from "Round 1" to "Round 1 (prescreening)".
// #reviewTabs is for the editors view, #externalReviewRoundTabs for externals (authors, ...)
// but we do the very same both time.
// -------------------------------------------------------------------
const func_review_round1 = function(x) {
	if ($(x).is("#reviewTabs") || $(x).is("#externalReviewRoundTabs")) {
		$(x).find("ul > li > a:contains('Round\u00a01')").html("Round\u00a01\u00a0(prescreening)");
	}
};

// -------------------------------------------------------------------
// In OJS 3.3 we check if a form node with the id #submitStep3Form
// is added. If so, search for divs which contains a label with
// the text "Prefix", "Subtitle", "Title" (exact match). The first
// two are set to hidden, the last one is slightly modified.
// -------------------------------------------------------------------
const func_submission_submitStep3Form = function(x) {
	if ($(x).is("#submitStep3Form")) {
		// Hide Prefix, Subtitle
		$(x).find("div:has(> label:contains('Prefix')), div:has(> label:contains('Subtitle'))").hide();

		// Adjust title
		var target = $(x).find("div:has(> label:contains('Title'))");
		$(target).css("width", "100%").css("padding-bottom", "1em");
		$(target).find("label").addClass("jss-js-modified-css");
	}
}

//just a testing function
function func_andyCat(node){
	if ($(node).is(".pkp_modal.pkpModalWrapper")
		&& $(node).parent(".pkp_page_management.pkp_op_settings.modal_is_visible")
		&& $(node).children().is(".pkp_modal_panel")
		&& $(node).children().is(":contains('Citation Style Language')")
		){
		//console.log("A CAT WILL BE SHOWN SOON");
		$(node).css({
            'background-image': 'url("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnQ4a3ZlNW9nOWswcHRseHlscGRzdHQxcXdpNzdycG9zMnYxeXA1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ES4Vcv8zWfIt2/giphy.gif")',
            'background-size': '100px 100px',
            'background-repeat': 'repeat'
        });
	}
}
//again only a testing function
function func_andy_trying(x) {
	if ($(x).is(".pkp_modal.pkpModalWrapper")){
		console.log("FOUND IT ")
		let y = $(x).find("#citationStyleLanguageSettingsForm")
		if($(y).length == 1) {
			console.log("FOUND IT AGAIN")
		}
		//		if ($('.header:contains("Citation Style Language")').length > 0) {
		if ($(x).find('.header:contains("Citation Style Language")').length > 0) {
			console.log("The header 'Citation Style Language' exists in the node.");
		} else {
			console.log("The header 'Citation Style Language' does not exist in the node.");
		}
	}
}


// ===================================================================
// MutationObserver: Observes newly added elements used to manipulate
// some of the on-the-fly added HTML elements on the backend.
// ===================================================================
$(document).ready(function() {

	const observer = new MutationObserver((mutationsList) => {
		mutationsList.forEach(({addedNodes}) => {
			addedNodes.forEach(node => {
				//DEVEL//console.log(node);
				//func_andy_trying(node);
				func_andyCat(node);
				func_start_discussion_wait(node);
				func_start_new_review_round(node);
				func_forms_skipEmail_and_skipDiscussion(node);
				func_decision_revision_attachments(node);
				func_decision_option_and_include_review(node);
				func_send_issue_notification(node);
				func_add_reviewer_regularReviewerForm(node);
				func_review_round1(node);
				func_submission_submitStep3Form(node);
				func_assign_participant_form(node);
			});
		});
	});
	//Explained: the actual MutationObserver usage looks like this: 
	//	const observer = new MutationObserver((mutationsList))
	// where mutationsList is the callback-function that is called every time the 
	// MutationObserver "senses" a change. 
	//we just add an arrow-function (https://www.w3schools.com/js/js_arrow_function.asp)
	//	this function takes as input an array of all the different mutations that occurred, 
	// 	(an array of MutationRecord objects)
	//	each MutationRecord object has multiple properties (like type, target, and addedNodes)
	//	we take this addedNodes (a NodeList of nodes that were added to the DOM) and loop through
	//	Each of added node. 
	//	for each such node we use that node to call the different functions. 




	// Start observing the target node with the configured options
	observer.observe(document.body, {childList: true, subtree: true});
	//Explained: this is the observe() function from our MutationObserver "observer".
	//here we tell it what to watch in the DOM and how to watch it:
	//	Target node to observe → document.body
	//	Configuration options → { childList: true, subtree: true }
	//		childList – changes in the direct children of node,
	//		subtree – in all descendants of node,


}); // End on document ready
