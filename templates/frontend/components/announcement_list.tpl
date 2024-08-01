{**
 * templates/frontend/components/announcement_list.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Common site navigation showing latest news list.
 *
 * @uses $requestedPage string Used to suppress one or another thing maybe.
 * @uses $announcements array List of announcements
 *}

	<h2 class="title pkp_screen_reader">{translate|escape key="plugins.themes.bootstrap3JSS.latestAnnouncements"}</h2>
	<h2 class="title">{translate|escape key="plugins.themes.bootstrap3JSS.latestAnnouncements"}</h2>
	        
	<ul>
	        {capture assign="acounter"}{1}{/capture}
	        {foreach from=$announcements item=announcement}
	                {include file="frontend/objects/announcement_list_entry.tpl"}
	                {capture assign="acounter"}{$acounter + 1}{/capture}
	                {if $acounter > $jssAnnouncementLimit}{break}{/if}
	        {/foreach}
	</ul>
