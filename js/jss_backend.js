// -------------------------------------------------------------------
// This is our backend JS script which uses a MutationObserver
// to check every new node added. For each node a series of
// functions are executed to manipulate a few elements here
// and there.
//
// Check the last 20-ish lines of the code to see what is done,
// the rest is just a series of function definitions.
// -------------------------------------------------------------------




//ojs34: This function seems to be OBSOLETE/NOT NECESSARY ANYMORE.
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

//testing: Andy: it seems "skip this email" is still displayed for me. therefore investigate. 
		//"Skip Email" seems to NOT be added as a node, 
		// but be present on new "Accept Submission: Notify Authors" page "from the start" 
		// -> therefore it is not picked up by our search. 
		//var skipEmailDivsAndy = $(x).find(".decision__footer.decision__skipStep -linkButton"); 
		var skipEmailDivsAndy = $(".decision__footer").find("button.decision__skipStep.-linkButton");
		$.each(skipEmailDivsAndy, function() {
			alert("Found: skipEmailDivsAndy " + $(this))
		});
		//Check back with Reto if this is the intended target. -> finetune search for it/find other way to hide it. 



	if ($(x).is("form")) {
		// Looking for element with id "skipEmail-send" within (x). 
		//".section:has(#skipEmail-send)": Selects every element with class section that contains at least one descendant element with the ID skipEmail-send.
		// returns a jQuery object containing all .section elements inside x that have such a descendant. 
		// Whenever found, make sure it is checked (do send email; don't skip) 
		// and hide closest parent div behind a text.
		var skipEmailDivs = $(x).find(".section:has(#skipEmail-send)");
		$.each(skipEmailDivs, function() {
			// Now do the following with it
			// - extract content
			// - remove the id from the div; add new id and class (we won't rely
			//   on the id for further manipulation in case it occurs more than
			//   once - which is should not!)
			// - add content of existing div to the new div
			alert("Found: " + $(this))
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
			alert("Found: " + $(this))
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
// Updated for ojs3.4
// When adding a production editor, automatically change
// the email template to 'add production editor'. ("PRODUCTION_EDITOR_ASSIGNED_DISCUSSION_NOTIFICATION_COPYEDITING")
// (Note: when changing selection away from "Production Editor" in the form -> the Message is NOT cleared automatically.)
// -------------------------------------------------------------------
const func_assign_participant_form = function(x) {
	if ($(x).is("#addParticipantForm")) {
		//alert("Found Participant form");
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
				var tmp = $(templates).find("option[value = 'PRODUCTION_EDITOR_ASSIGNED_DISCUSSION_NOTIFICATION_COPYEDITING']");
				if (tmp.length == 1) {
				    $(templates).val("PRODUCTION_EDITOR_ASSIGNED_DISCUSSION_NOTIFICATION_COPYEDITING").trigger("change");
				}
			}
		});
	}
}

// -------------------------------------------------------------------
// Adding a note on the form which initializes new review rounds.
// -------------------------------------------------------------------
//not working in ojs34 
const func_start_new_review_roundOLD = function(x) {
	if ($(x).is("#newRoundForm")) {
		$(x).before("<div class=\"pkp_notification jss_notification\"><div class=\"notifyInfo\" style=\"margin-bottom: 0;\">" +
					"<strong>Important:</strong><br/>" +
					"Do <strong>not start a new review</strong> round immediately after requesting revision!<br/>" +
					"A new round is initialized <strong>once the authors have uploaded all revisions</strong> and the material is ready for a new review round. " +
					"See section 'Revisions' in our <a href=\"/guides/editors\" target=\"_new\">Editorial guide</a>." +
					"</div></div>");
	}
}


//as the "New Review Round Start Screen" is now a new webpage and not only a popup, 
// the Mutation-observer is not the right tool to look for that. 
const NON_MUT_OBSERVER_start_new_review_round = function() {
	//exact text we want to find. above this we want to add a NOTE BEFORE NEW REVIEW ROUND
	const exactPText = "Send an email to the authors to let them know that their submission has been sent for a new round of review. This email will not be sent until the decision has been recorded.";
	const requiredH2Text = "Notify Authors";

	// New: Initial check for the existence of any div.panelSection__content
	const $allPanelSections = $('div.panelSection__content');
	if ($allPanelSections.length === 0) {
	  // console.log("No div.panelSection__content elements found. Exiting.");
	  return; // Exit the function early if no base elements are present
	}	

	// Proceed with the more specific filtering only if base elements exist
	const $targetDiv = $allPanelSections.filter(function() {
		const $this = $(this);
		const h2Text = $this.find('h2').text().trim();
		const pText = $this.find('p').text().trim();	
		return h2Text === requiredH2Text && pText === exactPText;
	});	
	// Check if the specific target div was found after filtering
	if ($targetDiv.length) {
		//get immediate parent of current target div
		const $parentSectionDiv = $targetDiv.closest('div.panelSection.decision__stepHeader');
		
		if ($parentSectionDiv.length) {
			const notificationHtml = `
			  <div class="pkp_notification jss_notification">
			    <div class="notifyInfo" style="margin-bottom: 0;">
			      <strong>Important:</strong><br/>
			      Do <strong>not start a new review</strong> round immediately after requesting revision!<br/>
			      A new round is initialized <strong>once the authors have uploaded all revisions</strong> and the material is ready for a new review round.
			      See section 'Revisions' in our <a href="/guides/editors" target="_blank" rel="noopener noreferrer">Editorial guide</a>.
			    </div>
			  </div>
			`;
			$parentSectionDiv.before(notificationHtml);
			// console.log("Added 'NOTE BEFORE NEW REVIEW ROUND' notification.");
		}
	}
};





// -------------------------------------------------------------------
//still working in ojs34. Could use improvement for removing this text, when the form has finished loading. 
//collecting some ideas/notes for that: 
//https://getbootstrap.com/docs/4.0/components/modal/
//
// The 'Add discussion' form can take some time to be loaded.
// If the user clicks somewhere else (closes) early, an empty discussion
// is started which helps no one. Thus, we show a quick note.
// -------------------------------------------------------------------
const func_start_discussion_wait = function(x) {
	if ($(x).is(".pkp_modal")) {
		let div = $(x).find(".pkp_modal_panel > .header:contains('Add discussion')");
		let subtitle = $("<div class=\"jss_subtitle\">Please wait while form is loading.</div>");
        $(div).append(subtitle);
		
		//setInterval(() => {
		//	let spinner = $(x).find("span.pkp_spinner");
		//  	const opacity = window.getComputedStyle(spinner[0]).opacity;
		//  	if (opacity === '0') {
		//    	console.log('Opacity is now 0');
		//		//want to set subtitle opacity to 0
		//		$(subtitle).css('opacity', '0');
		//		return;
		//  	}
		//}, 100);
	}
};

//New approach to "Prevent empty discussions because of slow 'discussion-modal' load"
// The 'Add discussion' form can take some time to be loaded.
// If the user clicks somewhere else (closes) early, an empty discussion
// is started which helps no one. Thus, we show a quick note.
//
//this utilizes another mutationObserver (here called tinyObserver),
// and checks if the tinyMCE has loaded and is visible. 
// -------------------------------------------------------------------
const observeTinyMCEAndRemoveSubtitle = function(targetElement, $subtitle) {
    if (!$subtitle || !$subtitle.length || !targetElement) {
        // If subtitle is already gone, or targetElement is invalid, do nothing or log error.
        if (targetElement) {
            console.error("Invalid subtitle or target element provided for TinyMCE observation.");
        }
        $subtitle?.remove(); // Safely try to remove if it exists, for cleanup
        return;
    }

    let tinyObserver = null; // Declare observer here for global scope within the function

	const fadeOutAndRemove = () => {
        // Use fadeOut() to smoothly transition the element out.
        // The element is removed from the DOM only after the animation completes.
        $subtitle.fadeOut(1000, function() {
            $(this).remove();
        });
        tinyObserver?.disconnect();
        //console.log("TinyMCE editor is now fully visible and rendered.");
    };

    const checkAndComplete = () => {
        const tinyMceContainer = $(targetElement).find('.tox.tox-tinymce[role="application"]')[0];
        if (tinyMceContainer) {
            const isVisible = $(tinyMceContainer).is(':visible') && $(tinyMceContainer).css('visibility') !== 'hidden';
            if (isVisible) {
				//alert("checkAndComplete: tinyMceContainer is visible"); //finally getting past here! 
                fadeOutAndRemove();
                return true; // Indicate completion
            }
        }
        return false; // Not yet complete
    };

    // 1. Immediate check: Is TinyMCE already present and visible?
    if (checkAndComplete()) {
        return; // If yes, we're done
    }

    // 2. If not immediately visible, set up a MutationtinyObserver
    tinyObserver = new MutationObserver((mutationsList, currentObserver) => {
        // We can just call checkAndComplete inside the callback.
        // It will disconnect the observer if successful.
        checkAndComplete();
    });

    // Observe both child additions (for TinyMCE appearing) and attribute changes (for its style/visibility)
    // The `subtree: true` is crucial for finding elements nested deep within the targetElement.
    tinyObserver.observe(targetElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    // 3. Fallback timeout: Ensure subtitle is removed even if observation fails
    setTimeout(() => {
        if ($subtitle.is(':visible')) {
            fadeOutAndRemove();
            console.warn("Forced removal of loading message after timeout. TinyMCE might not have loaded or observer missed it.");
        }
    }, 10000); // 10 seconds fallback
};

const func_start_discussion_wait_andy = function(node) {
    // Basic validation: ensure is the one modal we are looking for. 
    //if (!$(node).is(".pkp_modal.pkpModalWrapper.is_visible")) {
    if (!$(node).is(".pkp_modal")) {
        
		return;
    }
	//alert("it's the pkp_modal!"); //getting past here works!

    const $modalElement = $(node);

    // Locate the header where the subtitle will be appended
    const $headerDiv = $modalElement.find(".pkp_modal_panel > .header:contains('Add discussion')");
    if (!$headerDiv.length) {
        console.warn("Modal header for 'Add discussion' not found within modal:", node);
        return;
    }

    // Prevent adding multiple subtitles to the same modal
    if ($headerDiv.find('.jss_subtitle').length > 0) {
        return;
    }

    // Create and append the loading subtitle
    const $subtitle = $("<div class=\"jss_subtitle\">Please wait while form is loading.</div>");
    $headerDiv.append($subtitle);
   //console.log("Loading subtitle added to modal:", node.id);

    // Get the content area which is the parent of where TinyMCE will appear
    const modalContentArea = $modalElement.find(".pkp_modal_panel > .content")[0];

    // Initiate the TinyMCE observation process with the content area and subtitle
    observeTinyMCEAndRemoveSubtitle(modalContentArea, $subtitle);
};






// -------------------------------------------------------------------
// "Request revision" - Patch: 
// when Journal editor clicks "Request Revision" 
//	-> we change the pre-selected option to: "Revisions will be subject to a new round of peer reviews."
// other patches run in different function, as they are on another page. 
// -------------------------------------------------------------------
const func_decision_option_and_include_review = function(x) {
	if ($(x).is('div.v--modal-overlay[data-modal="selectRevisionDecision"]')) {
  		//alert("Found 'div.v--modal-overlay[data-modal=\"selectRevisionDecision\"]'");
		//Auto-Check the option: "Revisions will be subject to a new round of peer reviews.""

		setTimeout(() => {
  			$('input[name="decision"][value="5"]').prop('checked', true);
		}, 250);
	}
}



//TODO: needs "beatiful pink" warning: "Please wait, while reviews are being attached"
// below the "Notify Authors" 
//that is removed after action has been completed (fadeOut())
//this version is not quite working, revised version below. -> why?? 

//helper-functions, that might be useful for other such endeavors: 

//hide modal visibilty and event blocking
const hide_modal_visibiltiy = function(allModals){
	if (allModals.length > 0) {
    	allModals.forEach(modal => {
    	  	modal.style.opacity = '0';
    	  	modal.style.pointerEvents = 'none';
    	  	const keyboardBlocker = function(e) {
    	  	  	e.preventDefault();
    	  	  	e.stopPropagation();
    	  	};
    	  	modal.addEventListener('keydown', keyboardBlocker, true);
    	  	modal._keyboardBlocker = keyboardBlocker;
    	});
  }	
}
//Helper Function takes an array of modals that have been hidden and reverts their visibility back to "see-able"
const revert_modal_visibility = function(allModals) {
    allModals.forEach(modal => {
      modal.style.opacity = '';
      modal.style.pointerEvents = '';
      if (modal._keyboardBlocker) {
        modal.removeEventListener('keydown', modal._keyboardBlocker, true);
        delete modal._keyboardBlocker;
      }
    });
  };
  
//Why is this a NON_MUT_OBSERVER? -> give reason below. 
//Reason for this function not being started by a mutation observer:
//Mutation observer is triggered, whenever a change on a page THAT HAS FINISHED LOADING occurs. 
//As the data we are looking for is present on the newly loaded page -> mutation observer is not triggered. 
// Therefore we need to use a different way to observe this 
// - here by checking for a certain text in the document, once when it is loaded.
//TODO: better alternative to this: possibly JS Promises + async/await. 
//currently reading up on this. 
//possible solution see: https://g.co/gemini/share/8099f3fd3899
const NON_MUT_OBSERVER_request_revision_ATTACH_FILES = function() {

	//This part checks if the document we are lookin for has been loaded. 
	// By comparison of text. 
	// Exits function if the text is NOT found.
  	const exactPText = "Send an email to the authors to let them know that revisions will be required before this submission will be accepted for publication. Include all of the details that the author will need in order to revise their submission. Where appropriate, remember to anonymise any reviewer comments. This email will not be sent until the decision is recorded.";
  	const requiredH2Text = "Notify Authors";

  	const $allPanelSections = $('div.panelSection__content');
  	if ($allPanelSections.length === 0) return;

  	const $targetDiv = $allPanelSections.filter(function() {
  	  	const $this = $(this);
  	  	const h2Text = $this.find('h2').text().trim();
  	  	const pText = $this.find('p').text().trim();
  	  	return h2Text === requiredH2Text && pText === exactPText;
  	});
  	if (!$targetDiv.length) return;
	//Below this: We are in the document we are looking for.
	
	//Insert jss_important notice here.
	var $notifyAuthorContent = $('div.panelSection__content').filter(function() {
  		// Check if h2 text matches
  		var hasNotifyTitle = $(this).find('h2').first().text().trim() === 'Notify Authors';
  		// Check if this div's closest ancestor with classes panelSection and decision__stepHeader exists
  		var hasCorrectParent = $(this).closest('div.panelSection.decision__stepHeader').length > 0;
  	return hasNotifyTitle && hasCorrectParent;
	});

	$notifyAuthorContent.append(`
			  <div class="pkp_notification jss_notification jss_requestRevisions" style="padding-top:1em;">
			    <div class="notifyInfo_header jss_notification jss_requestRevisions" style="margin-bottom: 0;">
			      <strong>Important:</strong><br/>
				  	<div class="notifyInfoContent_trying">
				  		Trying to automatically attach review files ...
					</div>
			    </div>
			  </div>
			`);
	var $notifyInfo_header = $notifyAuthorContent.find('.pkp_notification .notifyInfo_header.jss_notification.jss_requestRevisions');
	
	
	//Adding next mut-observer:
	const tinyMceObserver = new MutationObserver((tinyMceMutationList, tinyObserver) => {
		const buttonSelector = document.querySelector('button.tox-tbtn.tox-tbtn--select');

		const selector = 'button.tox-tbtn.tox-tbtn--select';

		
		tinyMceMutationList.forEach(({addedNodes}) => {
			addedNodes.forEach(node => {
				console.log("asdfasdf");
				console.log(node);
				const foundButton = node.find(selector);
				if(foundButton.length == 0){
					//TODO
					//this does not work -> change to call rest of function in separate function if length >0
					// check why MUTATION OBSERVER at bottom is NOT working for this????
					return;};
			});
		});
		
		//if(!buttonSelector){
		//	//Checks if the modalOverlay has been detected, otherwise returns and waits for next mutation to check again. 
		//	return; // wait for next mutation
		//}
		//console.log("xxxx");
		//console.log(tinyMceMutationList);
		alert("woohoo");
		tinyObserver.disconnect();
		console.log("WOOHOO");

	//Find the "Attach Files Button"
  	const attachFilesBtn = document.querySelector('.tox-tbtn--select');
  	if (!attachFilesBtn) {
  	  	console.warn('Attach Files button not found. Assuming no review files available');
		//alert('Attach Files button not found.');	//only testing
		//TODO: add: into jss_warning-> "No files have been added"
		$notifyInfo_header.find('.notifyInfoContent_trying').
		html(`
				Failed to automatically attach review files.<br/>
				Please make sure to manually attach the required review files, by using the <strong>Attach Files</strong> button
				above the message field.
			`);
  	  	return;
  	}

  	// Hide modals and block keys (if any exist right now)
  	const allModals = document.querySelectorAll(".modal");
  	hide_modal_visibiltiy(allModals); 

  	// Start by clicking the "Attach Files" button to open modal
  	attachFilesBtn.click();

  	// Observe for modal overlay appearance
  	const bodyObserver = new MutationObserver((mutations, observer) => {
    	const modalOverlay = document.querySelector('.v--modal-overlay.scrollable');
    	if (!modalOverlay) {
			//Checks if the modalOverlay has been detected, otherwise returns and waits for next mutation to check again. 
			//i think no need to make modals visible again yet
			return; // wait for next mutation
		}
		hide_modal_visibiltiy([modalOverlay]); //necessary, as the modal class / its style is somehow changed when entering here. 

    	// Modal overlay found, stop observing document.body
    	observer.disconnect();

		
    	// Find "Attach Review Files" button inside modal
		//THIS STILL NEEDS A MUTATION OBSERVER!!! -> check if done????
		const attachReviewFilesObserver = new MutationObserver((mutations2, observer2) => {

    		const attachReviewFilesBtn = modalOverlay.querySelector('.fileAttacher #attacher1 button.pkpButton');
    	
			if (!attachReviewFilesBtn) {	//not yet there. wait on next mutation. 
    		  	console.warn('Attach Review Files button not found.');
    		  	return;
    		}

			//alert('Attach Review Files button found!'); //testing only

      		observer2.disconnect();

    		attachReviewFilesBtn.click();
			//----------------------------------------------------------------------------------------------------------------

    		const checkboxListObserver = new MutationObserver((mutations3, observer3) => {
				//This might create problems when there ARE NO REVIEWS TO BE ATTACHED! 
				//const allCheckboxes = modalOverlay.querySelectorAll('.fileAttacherReviewFiles input[type="checkbox"]');
				const allCheckboxes = modalOverlay.querySelectorAll('.v--modal-box.v--modal .fileAttacherReviewFiles input[type="checkbox"]');
        		if (allCheckboxes.length === 0) {
					let noFiles = modalOverlay.querySelector('.fileAttacherReviewFiles__noFiles');
					if(noFiles){
						//alert('no review files available to attach.');
						//TODO: we need to close out of the modal / all modals. 
						//the closing by "esc" is not yet working.
						const escEvent = new KeyboardEvent('keydown', {
						  	bubbles: true,
						  	cancelable: true,
						  	key: 'Escape',
						  	code: 'Escape',
						  	keyCode: 27,   // deprecated but sometimes still needed
						  	which: 27      // deprecated but sometimes still needed
						});
						document.dispatchEvent(escEvent);
						
						$('.v--modal-box.v--modal .modal__closeButton').each(function() {
						  	$(this).click(); // Trigger the click event to close the modal
						});

						$notifyInfo_header.find('.notifyInfoContent_trying').
						html(`
							No review files have been attached automatically.<br/>
							Please make sure to manually attach the required review files, by using the <strong>Attach Files</strong> button
							above the message field.
						`);



						//and we need to reset the modal visibility with 
						revert_modal_visibility(allModals);
						revert_modal_visibility([modalOverlay]);
						//and we need to exit out of the function, so the javascript can keep running/end. 
						observer3.disconnect();
						console.log("No reviewer-files to be attached."); 
						return; //TODO: check if that works ok

					}
					
					return; // Wait until at least one checkbox appears
				}
				//alert("Found allCheckboxes");
				observer3.disconnect();

    			// Select all checkboxes by clicking them to trigger UI events
    		  	allCheckboxes.forEach(chk => {
    		  	  if (!chk.checked) {
    		  	    chk.click();
    		  	    chk.dispatchEvent(new Event('change', { bubbles: true }));
					//alert("checked a checkbox");
    		  	  }
    		  	});

				//console.log("All checkboxes checked"); //getting to here


				// Step 4: Wait for "Attach Selected" button to be present and enabled before clicking
				const footer = modalOverlay.querySelector('.fileAttacher__footer');
				if (!footer) {
  					console.log('fileAttacher__footer container not found.');
  					// revert_modal_visibility(allModals);
  					return;
				}
				//if(footer) console.log("footer found"); //getting past here. 

				const attachSelectedObserver = new MutationObserver((mutations4, observer4) => {
					// Try to find enabled "Attach Selected" button first
					//let attachSelectedBtn = modalOverlay.querySelector('.fileAttacherReviewFiles .buttonRow button.pkpButton:not([disabled])');
					// const attachSelectedBtn = modalOverlay.querySelector('.fileAttacher__footer > button.pkpButton');
					const buttons = footer.querySelectorAll('button.pkpButton');
					if(buttons.length > 0 ) console.log("some buttons found");
  					const attachSelectedBtn = Array.from(buttons).find(btn => btn.textContent.trim() === 'Attach Selected');
				
				
					if (!attachSelectedBtn) {
						// Button not in DOM yet, keep waiting
						return;
					}
					if (attachSelectedBtn.disabled) {
						// Wait until enabled before clicking
						return;
					}
					console.log("Found AttachSelectedBtn");
					// alert("Found attachSelectedBtn");
					
					// Button present and enabled -> disconnect observer and click
					observer4.disconnect();
				
					attachSelectedBtn.click();
					// alternatively:
					//attachSelectedBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
				
					// Close modal programmatically
					//const closeButton = modalOverlay.querySelector('.v--modal-box.v--modal .modal__closeButton');
					//if (closeButton) closeButton.click();
				
					// Restore modal visibility and unblock keyboard
					revert_modal_visibility(allModals);
				});
				//TODO: PROBLEM WHEN THERE ARE NO REVIEWS TO BE ATTACHED? 
				//could the problem be the not idealy used modalOverlay here? 
				//might there be a better DOM element to watch?
				attachSelectedObserver.observe(modalOverlay, { childList: true, subtree: true, attributes: true});
    		});
    		checkboxListObserver.observe(modalOverlay, { childList: true, subtree: true, attributes: true});

  		});
		attachReviewFilesObserver.observe(modalOverlay, { childList: true, subtree: true });
  	});
  	// Start observing the body for modal overlay insertion
  	bodyObserver.observe(document.body, { childList: true, subtree: true });
	//debugger; //here the modal class is somehow changed, the style is "removed"?? possibly the changing
	//this should now be solved, with an additional hide_modal_visibility() on modalOverlay. 
	});

	tinyMceObserver.observe(document.body, {childList: true, subtree: true});
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Start: Helper functions for async request revision email attachment

/**
 * Waits for a DOM element matching the given selector to appear within a parent element.
 * Performs an immediate check first, then sets up a MutationObserver if not found.
 * Resolves with the element or rejects after a timeout.
 * @param {string} selector - CSS selector to match the element.
 * @param {Element} [parent=document] - Parent element to search within.
 * @param {number} [timeout=7000] - Timeout in milliseconds.
 * @returns {Promise<Element>} Promise resolving to the found element.
 */
function waitForElement(selector, parent = document, timeout = 7000) {
  	return new Promise((resolve, reject) => {
  	  	// Immediate check
  	  	const el = parent.querySelector(selector);
  	  	if (el) return resolve(el);

  	  	// Observer for future appearance
  	  	const observer = new MutationObserver(() => {
  	  	  	const found = parent.querySelector(selector);
  	  	  	if (found) {
  	  	  	  	observer.disconnect();
  	  	  	  	resolve(found);
  	  	  	}
  	  	});
  	  	observer.observe(parent, { childList: true, subtree: true });
  	  	
		setTimeout(
			() => {
  	  	  		observer.disconnect();
  	  	  		reject(new Error('Timeout: ' + selector)); //throws as error at the 'await'
  	  		},
			timeout);
  	});
}

/**
 * Waits for a button element to become enabled (not disabled).
 * Performs an immediate check first, then sets up a MutationObserver if disabled.
 * Resolves with the button or rejects after a timeout.
 * @param {HTMLButtonElement} button - The button element to monitor.
 * @param {number} [timeout=7000] - Timeout in milliseconds.
 * @returns {Promise<HTMLButtonElement>} Promise resolving to the enabled button.
 */
function waitForButtonEnabled(button, timeout = 7000) {
	return new Promise((resolve, reject) => {
		if (!button) return reject(new Error('Button not found'));
		if (!button.disabled) return resolve(button);
		
		const observer = new MutationObserver(
			() => {
				if (!button.disabled) {
					observer.disconnect();
					resolve(button);
				}
			}
		);
		observer.observe(button, { attributes: true });
		
		setTimeout(
			() => {
				observer.disconnect();
				reject(new Error('Timeout: button not enabled'));
			},
			timeout);
	});
}

/**
 * Hides the visibility of modal elements by setting their opacity to 0 and disabling pointer events.
 * @param {NodeList|Array<Element>} modals - An array or NodeList of modal elements to hide.
 */
function hideModalVisibility(modals) {
	if (!modals || !modals.length) return;

	modals.forEach(
		modal => {
			modal.style.opacity = 0;
			modal.style.pointerEvents = 'none';
		}
	);
}

/**
 * Reverts the visibility of modal elements by resetting their opacity and pointer events to default.
 * @param {NodeList|Array<Element>} modals - An array or NodeList of modal elements to revert.
 */
function revertModalVisibility(modals) {
	if (!modals || !modals.length) return;

	modals.forEach(
		modal => {
			modal.style.opacity = '';
			modal.style.pointerEvents = '';
		}
	);
}

//new approach: try "scanning" the html-skeleton, that is delivered.
//that should be stable, before, during and after VUE rendering of the page. 
//currently quick and dirty testing -> NEEDS TODO cleanup and improve. 
//Multi-point match detection plan: 
//we check: 
//- "pkp_page_decion"&"pkp_op_record" in body class ?prop
//- "Vue" app exists
//-
function detectCorrectPage() {
  try {
    const EXACT_DESCRIPTION = 'Send an email to the authors to let them know that revisions will be required before this submission will be accepted for publication. Include all of the details that the author will need in order to revise their submission. Where appropriate, remember to anonymise any reviewer comments. This email will not be sent until the decision is recorded.';
    
	//checking for "pkp_page_decion"&"pkp_op_record" in class ?prop
    const bodyClassList = document.body.className;
    if (!bodyClassList.includes('pkp_page_decision') || !bodyClassList.includes('pkp_op_record')) {
      return { found: false, reason: 'Body classes do not match' };
    }
    
    // Verify Vue app exists
    if (!document.getElementById('app')) {
      return { found: false, reason: 'Vue app not found' };
    }
    
    // Get the registry data
    const result = extractStepDataFromRegistry();
    if (!result) {
      return { found: false, reason: 'Registry data not found' };
    }
    
    // Exact verification
    if (result.name === 'Notify Authors' && result.description === EXACT_DESCRIPTION) {
      return {
        found: true,
        method: 'registry_exact_match',
        data: result,
        confidence: 100
      };
    }
    
    return { found: false, reason: 'Step data does not match' };
    
  } catch (error) {
    console.error('Page detection error:', error);
    return { found: false, error: error.message };
  }
}
//helper for detectCorrectPage():
function extractStepDataFromRegistry() {
  try {
	//collection all <script> tags WITHOUT src attribute
    const scripts = Array.from(document.querySelectorAll('script:not([src])'));
    
    for (const script of scripts) {
      const content = script.textContent;
      
	  //for each script we check if ... or ... are included -> else skipped (as irrelevant)
      if (!content.includes('pkp.registry.init') || !content.includes('DecisionPage')) {
        continue;
      }
      
	  //regex used to find+save config obj passed to pkp.registry.init() 
      const initMatch = content.match(/pkp\.registry\.init\s*\(\s*['"]app['"]\s*,\s*['"]DecisionPage['"]\s*,\s*(\{[\s\S]*?\})\s*\)\s*;/);
      
	  //exit loop if not found
      if (!initMatch) continue;
      
      try {
		//converts raw text into working object-> so we can access step data
        const config = Function('"use strict"; return (' + initMatch[1] + ')')();
        
		//searches through the workflow steps -> returns notifyStep
        if (config && config.steps && Array.isArray(config.steps)) {
        	const notifyStep = config.steps.find(step => step.name === 'Notify Authors');
        	if (notifyStep) {
            	return notifyStep;
          	}
        }
      } catch (parseError) {
        console.warn('Parse error:', parseError);
        continue;
      }
    }
	//if nothing found-> return null
    return null;
  } catch (error) {
    console.error('Registry extraction error:', error);
    return null;
  }
}





//End: Helper functions for async request revision email attachment
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//TODO: check if this actually works -> testing! 

async function NON_MUT_OBSERVER_request_revision_ATTACH_FILES_async() {
	//Debuggin: -> already getting here.
	//console.log("NON_MUT_OBSERVER_request_revision_ATTACH_FILES_async called");
	
	//current testing - quick and dirty 
	const result = detectCorrectPage();
		if (result.found) {
  			console.log('Correct page detected'); //-> already getting here. 
  			// Proceed 
		} else {
			console.log('Wrong page:', result.reason);
			return; 
		}



  	// Step 1: Validate we're on the right page
  	const exactPText = 'Send an email to the authors to let them know that revisions will be required before this submission will be accepted for publication. Include all of the details that the author will need in order to revise their submission. Where appropriate, remember to anonymise any reviewer comments. This email will not be sent until the decision is recorded.';
  	const requiredH2Text = 'Notify Authors';
  	const panelSections = Array.from(document.querySelectorAll('div.panelSectioncontent'));
  	const targetDiv = panelSections.find(div => {
  	  	const h2 = div.querySelector('h2');
  	  	const p = div.querySelector('p');
  	  	return h2 && (h2.textContent.trim() === requiredH2Text) && p && (p.textContent.trim() === exactPText);
  	});
	
	//Debuggin: 
	console.log('panel sections:', panelSections);
	console.log('targetDiv:', targetDiv);
	//this targetDiv seems to be the problem. 
	//maybe not rendered yet-> therefore not found like this. 
	//use the detectCorrectPage() 

  	//if (!targetDiv) {
	//	console.log("targetDiv not found.")
	//	return; // Exit if not found
	//}

  	// Step 2: Insert notification
  	const notifyBox = document.createElement('div');
  	notifyBox.className = 'pkpnotification jssnotification jssrequestRevisions';
  	notifyBox.style.paddingTop = '1em';
  	notifyBox.innerHTML = `<div class="notifyInfoheader jssnotification jssrequestRevisions" style="margin-bottom: 0"><strong>Important</strong><br><div class="notifyInfoContenttrying">Trying to automatically attach review files ...</div></div>`;
  	targetDiv.appendChild(notifyBox);

	
	try {
		// Step 3: Wait for TinyMCE button to appear -> find attachBtn
    	const attachBtn = await waitForElement('button.tox-tbtn.tox-tbtn--select', document.body);
    	if (!attachBtn) throw new Error('Attach Files button not found');

		// Step 4: Hide all modals before clicking
		const allModals = document.querySelectorAll('.modal');
		hideModalVisibility(allModals);
		attachBtn.click();

		// Step 5: Wait for modal overlay to appear
		const modalOverlay = await waitForElement('.v--modal-overlay.scrollable', document.body);
		hideModalVisibility([modalOverlay]);

		// Step 6: Find Attach Review Files button inside modal
		const reviewFilesBtn = await waitForElement('.fileAttacher .attacher1 button.pkpButton', modalOverlay);
		reviewFilesBtn.click();

		// Step 7: Wait for the fileAttacherReviewFiles container to appear
		const reviewFilesContainer = await waitForElement('.fileAttacherReviewFiles', modalOverlay);
		if (!reviewFilesContainer) throw new Error('Review files container not found');

		// Check for the 'No items found' message
		const noFilesMsg = reviewFilesContainer.querySelector('.fileAttacherReviewFiles__noFiles');
		if (noFilesMsg) {
			notifyBox.querySelector('.notifyInfoContenttrying').innerHTML =
				'No review files found.<br>Please attach them manually.';
			revertModalVisibility(allModals);
			return;
		}
		
		// Otherwise, find checkboxes and proceed
		let checkboxes = Array.from(reviewFilesContainer.querySelectorAll('input[type="checkbox"]'));
		if (checkboxes.length === 0) {
			notifyBox.querySelector('.notifyInfoContenttrying').innerHTML =
				'No review files available to attach.<br>Please check manually.';
			revertModalVisibility(allModals);
			return;
		}
		
		// Step 8: Check all checkboxes
		checkboxes.forEach(
			cb => {
				if (!cb.checked) {
					cb.click();
					cb.dispatchEvent(new Event('change', {bubbles:true}));
				}
			}
		);

		// Step 9: Wait for enabled Attach Selected button then click
		const footer = await waitForElement('.fileAttacher__footer', modalOverlay);
		let btns = footer.querySelectorAll('button.pkpButton');
		let attachSelectedBtn = Array.from(btns).find(b => b.textContent.trim().includes('Attach Selected'));
		if (!attachSelectedBtn) throw new Error('No Attach Selected button found');
		await waitForButtonEnabled(attachSelectedBtn);
		attachSelectedBtn.click();

		// Step 11: Restore all modals and update message
		revertModalVisibility(allModals);
		notifyBox.querySelector('.notifyInfoContenttrying').innerHTML = 'Review files have been attached automatically.';


	} catch (err) {
		// Error handling and clean-up
		notifyBox.querySelector('.notifyInfoContenttrying').innerHTML =
			'No review files have been attached automatically.<br>Please make sure to manually attach the required review files.';
		revertModalVisibility(document.querySelectorAll('.modal'));
		console.warn('Failed request revision attach files:', err);
	}

}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




// -------------------------------------------------------------------
//beginning of modified version above. 
// Modify the form when an editor clicks "Request revision".
// There are a few bits and bobs going on inside (see comments).
// - #promote (accept)
// - #sendReviews (review, decline)
// -------------------------------------------------------------------
const func_decision_option_and_include_review_OLD = function(x) {
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

//trying to get mutObserver to recognice the tinymce as being newly loaded modal. 
function func_testing_tinymceObserver(x) {
	// Convert the node to a jQuery object for .find
    const $node = $(node);
    // Check if node itself is the button, or contains the button within its subtree
    if (
        $node.is('button.tox-tbtn.tox-tbtn--select') || 
        $node.find('button.tox-tbtn.tox-tbtn--select').length
    ) {
        console.log("FOUND tinyMCE with MUT OBSERVER");
        alert("FOUND tinyMCE with MUT OBSERVER");
    }
}


// ===================================================================
// MutationObserver: Observes newly added elements used to manipulate
// some of the on-the-fly added HTML elements on the backend.
// ===================================================================
$(document).ready(function() {
	console.log("Document now ready");
	//if ($('button.tox-tbtn.tox-tbtn--select').length) {
	//    console.log("Button exists -> MCE MUST BE LOADED ? ");
	//} else {
	//    console.log("NO BUTTON YET -> MCE PROB. NOT LOADED YET ");
	//}
	const observer = new MutationObserver((mutationsList) => {
		console.log("MutationObserver now running.");
		//if ($('button.tox-tbtn.tox-tbtn--select').length) {
		//    console.log("Inside MutationObserver: Button exists -> MCE MUST BE LOADED ? ");
		//} else {
		//    console.log("MutationObserver: NO BUTTON YET -> MCE PROB. NOT LOADED YET ");
		//}
		mutationsList.forEach(({addedNodes}) => {
			addedNodes.forEach(node => {
				//DEVEL//
				console.log(node);
				//func_andy_trying(node);
				//alert("Found: " + $(this));
				//func_testing_tinymceObserver(node);
				func_andyCat(node);
				//func_start_discussion_wait(node);
				func_start_discussion_wait_andy(node);
				//func_start_new_review_round(node);
				//func_forms_skipEmail_and_skipDiscussion(node);
				func_decision_revision_attachments(node);
				func_decision_option_and_include_review(node); //could be disabled, Patch available in php (Andy)
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


//-----------------------------------------------------------------
// NON MUTATION OBSERVER FUNCTIONS: 
// to be run once when the document is loaded. Not whenever a node is added. 

	NON_MUT_OBSERVER_start_new_review_round(); 
	//might be better to do in php...
	//NON_MUT_OBSERVER_request_revision_ATTACH_FILES(); 

	NON_MUT_OBSERVER_request_revision_ATTACH_FILES_async();
	

//-----------------------------------------------------------------


}); // End on document ready
