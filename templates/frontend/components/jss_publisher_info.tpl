{**
 * templates/frontend/components/jss_sponsors.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Common site navigation block with publisher information.
 *}

	<h2 class="title pkp_screen_reader">{translate|escape key="plugins.themes.bootstrap3JSS.journalinformation"}</h2>
	<h2 class="title">{translate|escape key="plugins.themes.bootstrap3JSS.journalinformation"}</h2>
	<div class="content">
	    <strong>{translate|escape key="plugins.themes.bootstrap3JSS.publisher"}:</strong>{$jssPublishedBy}<br />
	    <strong>{translate|escape key="plugins.themes.bootstrap3JSS.editorsinchief"}:</strong>{$jssEditorsInChief}<br />
	    <strong>{translate|escape key="plugins.themes.bootstrap3JSS.board"}:</strong><span><a href="{$baseUrl}/about/editorialTeam" target="_self">Editorial Team</a></span><br />
	    <strong>{translate|escape key="plugins.themes.bootstrap3JSS.ISSN"}:</strong>{$jssISSN}<br />
	    <strong>{translate|escape key="plugins.themes.bootstrap3JSS.CODEN"}:</strong>{$jssCoden}<br />
	</div>
