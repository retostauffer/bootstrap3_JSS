<?php

/**
 * @file plugins/themes/default/BootstrapThreeJSSThemePlugin.inc.php
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @class BootstrapThreeJSSThemePlugin
 * @ingroup plugins_themes_bootstrap3
 *
 * @brief Default theme
 */

import('lib.pkp.classes.plugins.ThemePlugin');
class BootstrapThreeJSSThemePlugin extends ThemePlugin {

        /*
	 * This was a test for creating dynamic content.
	 * This can be used in the templates (.tpl)
	 * by first 'loading' this module/hook (must be registered, see below)
	 * and then do the following in the .tpl file:
	 *
         * {capture assign="retoCode"}{call_hook name="Templates::Common::Reto"}{/capture}
         * {$retoCode}
	 *
	 * The first line captures whatever the hook contains, the second one simply prints
	 * the content.
	 *
         * @param $hookName string
         * @param $args array [
         *......@option array Params passed to the hook
         *......@option Smarty
         *......@option string The output
         * ]
         */
        public function reto($hookName, $args) {
            $params =& $args[0];
            $smarty =& $args[1];
            $output =& $args[2];

            /////$article = $smarty->getTemplateVars('article');

            $output  = "";
            $output .= "<div class=\"pkp_block\">\n";
            $output .= "  <h2 class=\"title\">Just a test</h2>";
            $output .= "  <div class=\"content\">\n";
            $output .= "    This content is created by a php function registered via hook ('reto').";
            $output .= "  </div>\n";
            $output .= "</div>";


            return false;
        }

        /**
         * Extracting issue number from publisher-id.
         *
         * In JSS we always have one issue per volume. Thus, the
         * submission number is always 1 and does not give us what we need.
         * Instead we register this new function/hook to be used on the frontend.
         *
         * Used in objects/article_details.tpl
         */
        public function get_jss_issue_number($hookName, $args) {
            $params =& $args[0];
            $smarty =& $args[1];
            $output =& $args[2];

            $article     = $smarty->getTemplateVars('article');
            $publication = $article->getCurrentPublication();
            $urlPath     = $publication->getData('urlPath');

            // Default is "N/A"
            $output = "N/A";
            preg_match("/^v([0-9]+)(\w)([0-9]+)$/", $urlPath, $res);
            if (is_array($res) && count($res) == 4) {
            	$output = sprintf("%d", (int)$res[3]);
            }

            return false;
        }


        /**
         * Initialize the theme
         *
         * @return null
         */
        public function init() {

        	# Required to be able to set variables for the templating engine
        	HookRegistry::register ('TemplateManager::display', array($this, 'loadTemplateData'));

        	HookRegistry::register('Templates::Common::Reto', [$this, 'reto']);
        	HookRegistry::register('Templates::Common::getJSSIssueNumber', [$this, 'get_jss_issue_number']);

        	$this->setParent('bootstrapthreethemeplugin');

        	// Register option for bootstrap themes
        	$this->removeOption('bootstrapTheme', 'FieldOptions');
        	$this->modifyStyle('bootstrap',
        	                    array('addLess' => array('styles/jss.less', 'fontawesome/less/fontawesome.less')));
		//$this->modifyStyle('pkpLib', array('addLess' => array('styles/jss_backend.less')));
		$this->addStyle('my-custom-style', 'styles/jss_backend.less', array( 'contexts' => 'backend' ));

		// Adding custom jQuery script to manipulate
		// some pages/popups without the need to change
		// the system or theme.
		$this->addScript('my-custom-script', 'js/jss_backend.js', array( 'contexts' => 'backend' ));
		
		
		
		$this->addScript('fontawesome', 'fontawesome/js/all.min.js');

        	$this->addMenuArea(array("footerMenu"));
        	$this->addMenuArea(array("footerMenuExternal"));

        	//////////$this->addOption("jss_publisher_top", "FieldOptions", [
        	//////////        "type" => "radio",
        	//////////        "label" => "Publisher shown top of page?",
        	//////////        "description" => "Enable/disable publisher on top of page",
        	//////////        "options" => [
        	//////////            ["value" => "1", "label" => "Yes"],
        	//////////            ["value" => "0", "label" => "No"],
        	//////////        ],
        	//////////    ]
        	//////////);
        	$this->addOption("jss_published_by", "FieldText", [
        	        "name" => "jss_published_by",
        	        "label" => "Published by ...",
        	        "default" => "Foundation for Open Access Statistics"
        	    ]
        	);
        	$this->addOption("jss_editors_in_chief", "FieldText", [
        	        "name" => "jss_editors_in_chief",
        	        "label" => "Our editors in chief"
        	    ]
        	);
        	$this->addOption("jss_issn", "FieldText", [
        	        "name" => "jss_issn",
        	        "label" => "JSSN number",
        	        "default" => "1548-7660"
        	    ]
        	);
        	$this->addOption("jss_coden", "FieldText", [
        	        "name" => "jss_coden",
        	        "label" => "CODEN identifier",
        	        "default" => "JSSOBK"
        	    ]
        	);
        	$this->addOption("jss_announcements_limit", "FieldText", [
        	        "name" => "jss_announcements_limit",
        	        "label" => "Number of announcements in sidebar-list (positive integer)",
			"default" => "3"
        	    ]
        	);

        }

	public function loadTemplateData($hookName, $args) {
		$templateMgr = $args[0];
		
		# Options to add
		$opts = ["jss_publisher_top"    => "jssPublisherTop",
		         "jss_coden"            => "jssCoden",
		         "jss_issn"             => "jssISSN",
		         "jss_published_by"     => "jssPublishedBy",
			 "jss_editors_in_chief" => "jssEditorsInChief",
			 "jss_announcements_limit" => "jssAnnouncementLimit"];
		
		# optname is the option name of the theme, varname
		# the final variable name used in the templates
		foreach ($opts as $optname=>$varname) {
			if ($this->getOption($optname)) {
				$res = $this->getOption($optname);
			} else {
				$res = "option not set!";
			}
			
			// Force integer if jss_announcements_limit
			if ($optname == "jss_announcements_limit") {
				preg_match("/^[0-9]+$/", $res, $tmp);
				if (is_array($tmp)) {
					$tmp = (int)$tmp[0];
					$res = ($tmp > 0) ? (string)$tmp : "3";
				} else {
					$res = "3"; # fallback
				}
			}
			
			// Assign
			$templateMgr->assign($varname, $res);
		}
	}

	/**
	 * Get the display name of this plugin
	 * @return string
	 */
	function getDisplayName() {
	        return "Bootstrap 3 for JSS";
	}
	
	/**
	 * Get the description of this plugin
	 * @return string
	 */
	function getDescription() {
	        return "Bootstrap 3 for JSS";
	}
}
