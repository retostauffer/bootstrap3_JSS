{**
 * templates/frontend/objects/issue_summary.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief View of an Issue which displays a summary for use in lists
 *
 * @uses $issue Issue The issue
 *}
<div class="col-sm-3">

	{* Retrieve separate entries for $issueTitle and $issueSeries *}
	{capture assign="issueTitle"}{$issue->getLocalizedTitle()}{/capture}
	{capture assign="issueSeries"}{$issue->getIssueSeries()}{/capture}
	{capture assign="issueYear"}{$issue->getYear()}{/capture}

	{* Show cover image and use cover description *}
	{if $issue->getLocalizedCoverImage()}
		<div class="media-left">
			<a class="cover" href="{url|escape op="view" path=$issue->getBestIssueId($currentJournal)}">
				<img class="media-object" src="{$issue->getLocalizedCoverImageUrl()|escape}" alt="{$issue->getLocalizedCoverImageAltText()|escape|default:''}">
			</a>
		</div>
	{/if}

	<div class="media-body">
		<h2 class="media-heading">
			<a class="title" href="{url|escape op="view" path=$issue->getBestIssueId($currentJournal)}">
				{if $issueTitle}
					{$issueTitle|escape}
				{else}
					{$issueSeries|escape}
				{/if}
			</a>,
			{if $issueTitle}
				{$issueYear|escape}
			{/if}
		</h2>
		<div class="description">
			{$issueDescription|strip_unsafe_html|nl2br}
		</div>
	</div>
</div><!-- .issue-summary -->
