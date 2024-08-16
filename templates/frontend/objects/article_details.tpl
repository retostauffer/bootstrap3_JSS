{**
 * templates/frontend/objects/article_details.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief View of an Article which displays all details about the article.
 *  Expected to be primary object on the page.
 *
 * @uses $article Article This article <- JSS: WE think that this is incorrect and
 *                                        we already get $publication (which is $article->getPublication()
 *                                        or something; see how $publication is defined in article_summary.tpl)
 * @uses $issue Issue The issue this article is assigned to
 * @uses $section Section The journal section this article is assigned to
 * @uses $keywords array List of keywords assigned to this article
 * @uses $citationFactory @todo
 * @uses $pubIdPlugins @todo
 *}
<article class="article-details">

        {* Notification that this is an old version *}
        {if $currentPublication->getId() !== $publication->getId()}
                <div class="alert alert-warning" role="alert">
                        {capture assign="latestVersionUrl"}{url page="article" op="view" path=$article->getBestId()}{/capture}
                        {translate key="submission.outdatedVersion"
                                datePublished=$publication->getData('datePublished')|date_format:$dateFormatShort
                                urlRecentVersion=$latestVersionUrl|escape
                        }
                </div>
        {/if}

        <header>
                <h1 class="page-header">
                        {$publication->getLocalizedTitle()|escape}
                        {if $publication->getLocalizedData('subtitle')}
                                <small>
                                        {$publication->getLocalizedData('subtitle')|escape}
                                </small>
                        {/if}
                </h1>

                {if $publication->getData('authors')}
                        <div class="authors authors_long">
                                {foreach from=$publication->getData('authors') item=author name=author}
					<nobr><span><strong>{$author->getFullName()|escape}</strong>{if $author->getOrcid()}<a href="{$author->getOrcid()|escape}" class="orcid" target="_blank" alt="ORCID: {$author->getOrcid()|escape}"><i class="fab fa-orcid"></i></a>{/if}{if not $smarty.foreach.author.last}, {/if}</span></nobr>
                                {/foreach}
                        </div>
                {/if}
        </header>

        <div class="row">

                <div class="col-xs-12">
                        <section class="article-main">

                                {* Screen-reader heading for easier navigation jumps *}
                                <h2 class="sr-only">{translate key="plugins.themes.bootstrap3.article.main"}</h2>

                                {* Article abstract *}
                                {if $publication->getLocalizedData('abstract')}
                                        <div class="article-summary" id="summary">
                                                <h2>{translate key="article.abstract"}</h2>
                                                <div class="article-abstract">
                                                        {$publication->getLocalizedData('abstract')|strip_unsafe_html|nl2br}
                                                </div>
                                        </div>
                                {/if}

                                {call_hook name="Templates::Article::Main"}

                        </section><!-- .article-main -->

                        <section class="article-more-details">

                            {* Screen-reader heading for easier navigation jumps *}
                            <h2 class="sr-only">{translate key="plugins.themes.bootstrap3.article.details"}</h2>

                            {* Screen-reader heading for easier navigation jumps *}
                            <h2 class="sr-only">{translate key="plugins.themes.bootstrap3.article.sidebar"}</h2>

                            {* Article/Issue cover image *}
                            {if $publication->getLocalizedData('coverImage') || ($issue && $issue->getLocalizedCoverImage())}
                                <div class="cover-image">
                                    {if $publication->getLocalizedData('coverImage')}
                                        {assign var="coverImage" value=$publication->getLocalizedData('coverImage')}
                                        <img class="img-responsive"
                                             src="{$publication->getLocalizedCoverImageUrl($article->getData('contextId'))|escape}"
                                             alt="{$coverImage.altText|escape|default:''}">
                                    {else}
                                        <a href="{url page="issue" op="view" path=$issue->getBestIssueId()}">
                                            <img class="img-responsive"
                                                 src="{$issue->getLocalizedCoverImageUrl()|escape}"
                                                 alt="{$issue->getLocalizedCoverImageAltText()|escape|default:''}">
                                        </a>
                                    {/if}
                                </div>
                            {/if}

                            {* --------------- BEGIN ARTICLE META INFORMATION ------------------- *}
                            <div class="pkp_block pkp_block_main article-meta">


                                {* Article Galleys *}
                                {if $primaryGalleys || $supplementaryGalleys}
                                <div class="row">
                                    <div class="col-xs-12 col-sm-3">
                                        <strong>{translate|escape key="plugins.themes.bootstrap3JSS.articlefiles"}:</strong>
                                    </div>
                                    <div class="col-xs-12 col-sm-8">
                                        {if $primaryGalleys}
                                            {foreach from=$primaryGalleys item=galley}
                                                {include file="frontend/objects/galley_link.tpl" parent=$article purchaseFee=$currentJournal->getSetting('purchaseArticleFee') purchaseCurrency=$currentJournal->getSetting('currency')}
                                            {/foreach}
                                        {/if}
                                        {if $supplementaryGalleys}
                                            {foreach from=$supplementaryGalleys item=galley}
                                                {include file="frontend/objects/galley_link.tpl" parent=$article isSupplementary="1"}
                                            {/foreach}
                                        {/if}
                                    </div>
                                </div>
                                {/if}

                                {* Published date *}
                                {if $publication->getData('datePublished')}
                                    <div class="row">
                                        {capture assign=translatedDatePublished}{translate key="submissions.published"}{/capture}
                                        <div class="col-xs-12 col-sm-3">
                                            <strong>{translate key="semicolon" label=$translatedDatePublished}</strong>
                                        </div>
                                        <div class="col-xs-12 col-sm-8">
                                            {$publication->getData('datePublished')|date_format}
                                        </div>
                                    </div>

                                    {* If this is an updated version *}
                                    {if $firstPublication->getID() !== $publication->getId()}
                                        <div class="row">
                                            {capture assign=translatedUpdated}{translate key="common.updated"}{/capture}
                                            <div class="col-xs-12 col-sm-3">
                                                <strong>{translate key="semicolon" label=$translatedUpdated}</strong>
                                            </div>
                                            <div class="col-xs-12 col-sm-8">
                                                {$publication->getData('datePublished')|date_format:$dateFormatShort}
                                            </div>
                                        </div>
                                    {/if}

                                    {* Versions *}
                                    {if count($article->getPublishedPublications()) > 1}
                                        <div class="row">
                                            <div class="col-xs-12 col-sm-3">
                                                <strong>{capture assign=translatedVersions}{translate key="submission.versions"}{/capture}
                                                {translate key="semicolon" label=$translatedVersions}</strong>
                                            </div>
                                            <div class="col-xs-12 col-sm-8">
                                                {foreach from=array_reverse($article->getPublishedPublications()) item=iPublication}
                                                    {capture assign="name"}{translate key="submission.versionIdentity" datePublished=$iPublication->getData('datePublished')|date_format:$dateFormatShort version=$iPublication->getData('version')}{/capture}
                                                    <div>
                                                        {if $iPublication->getId() === $publication->getId()}
                                                            {$name}
                                                        {elseif $iPublication->getId() === $currentPublication->getId()}
                                                            <a href="{url page="article" op="view" path=$article->getBestId()}">{$name}</a>
                                                        {else}
                                                            <a href="{url page="article" op="view" path=$article->getBestId()|to_array:"version":$iPublication->getId()}">{$name}</a>
                                                        {/if}
                                                    </div>
                                                {/foreach}
                                            </div>
                                        </div>
                                    {/if}

                                {/if} <!-- end if date published -->



                                {* DOI *}
                                {assign var=doiObject value=$article->getCurrentPublication()->getData('doiObject')}
                                {if $doiObject}
                                    {assign var="doiUrl" value=$doiObject->getData('resolvingUrl')|escape}
                                    <div class="row">
                                        {capture assign=translatedDoi}{translate key="doi.readerDisplayName"}{/capture}
                                        <div class="col-xs-12 col-sm-3">
                                            <strong>{translate key="semicolon" label=$translatedDoi}</strong>
                                        </div>
                                        <div class="col-xs-12 col-sm-8">
                                            <a href="{$doiUrl}">{$doiUrl|replace:"https://doi.org/":""}</a>
                                        </div>
                                    </div>
                                {/if}

                                {* Keywords *}
                                {if !empty($keywords[$currentLocale])}
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-3">
                                            <strong>{capture assign=translatedKeywords}{translate key="article.subject"}{/capture}
                                                    {translate key="semicolon" label=$translatedKeywords}</strong>
                                        </div>
                                        <div class="col-xs-12 col-sm-8">
                                            <span class="value">
                                            {assign var=kw value=$keywords[$currentLocale]}
                                            {foreach from=$kw item=keyword name=keyword}
                                                <form class="keyword-search" action="{$baseUrl}/search" method="post">
                                                    <input type="hidden" name="query" id="query" value="{$keyword|escape}">
                                                    <button>{$keyword|escape}</button>
                                                </form>
                                            {/foreach}
                                            </span>
                                        </div>
                                    </div>
                                {/if}
                            </div>

                  {* ----------------- END ARTICLE META INFORMATION ------------------- *}


                            {* PubIds (requires plugins) *}
                            {foreach from=$pubIdPlugins item=pubIdPlugin}
                                {if $pubIdPlugin->getPubIdType() == 'doi'}
                                    {continue}
                                {/if}

                                {if $issue->getPublished()}
                                    {assign var=pubId value=$article->getStoredPubId($pubIdPlugin->getPubIdType())}
                                {else}
                                    {assign var=pubId value=$pubIdPlugin->getPubId($article)}{* Preview pubId *}
                                {/if}

                                {if $pubId}
                                    <div class="row">
                                        <div class="col-xs-12 col-sm-4">
                                            {$pubIdPlugin->getPubIdDisplayType()|escape}
                                        </div>
                                        <div class="col-xs-12 col-sm-8">
                                            {if $pubIdPlugin->getResolvingURL($currentJournal->getId(), $pubId)|escape}
                                                <a id="pub-id::{$pubIdPlugin->getPubIdType()|escape}" href="{$pubIdPlugin->getResolvingURL($currentJournal->getId(), $pubId)|escape}">
                                                    {$pubIdPlugin->getResolvingURL($currentJournal->getId(), $pubId)|escape}
                                                </a>
                                            {else}
                                                {$pubId|escape}
                                            {/if}
                                            </div>
                                        </div>
                                        {/if}
                                {/foreach}

                                {* Author biographies *}
                                {assign var="hasBiographies" value=0}
                                {foreach from=$publication->getData('authors') item=author}
                                    {if $author->getLocalizedBiography()}
                                        {assign var="hasBiographies" value=$hasBiographies+1}
                                    {/if}
                                {/foreach}

                                {if $hasBiographies}
                                   <div class="panel panel-default author-bios">
                                       <div class="panel-heading">
                                           {if $hasBiographies > 1}
                                               {translate key="submission.authorBiographies"}
                                           {else}
                                               {translate key="submission.authorBiography"}
                                           {/if}
                                       </div>
                                       <div class="panel-body">
                                           {foreach from=$publication->getData('authors') item=author}
                                               {if $author->getLocalizedBiography()}
                                                   <div class="media biography">
                                                       <div class="media-body">
                                                           <h3 class="media-heading biography-author">
                                                               {if $author->getLocalizedAffiliation()}
                                                                   {capture assign="authorName"}{$author->getFullName()|escape}{/capture}
                                                                   {capture assign="authorAffiliation"}<span class="affiliation">{$author->getLocalizedAffiliation()|escape}</span>{/capture}
                                                                   {translate key="submission.authorWithAffiliation" name=$authorName affiliation=$authorAffiliation}
                                                               {else}
                                                                   {$author->getFullName()|escape}
                                                               {/if}
                                                           </h3>
                                                           {$author->getLocalizedBiography()|strip_unsafe_html}
                                                       </div>
                                                   </div>
                                               {/if}
                                           {/foreach}
                                       </div>
                                   </div>
                                {/if}

                                {* call_hook name="Templates::Article::Details" *}

                                {* References *}
                                {if $parsedCitations || $publication->getData('citationsRaw')}
                                    <div class="article-references">
                                        <h2>{translate key="submission.citations"}</h2>
                                        <div class="article-references-content">
                                            {if $parsedCitations}
                                                {foreach from=$parsedCitations item="parsedCitation"}
                                                    <p>{$parsedCitation->getCitationWithLinks()|strip_unsafe_html} {call_hook name="Templates::Article::Details::Reference" citation=$parsedCitation}</p>
                                                {/foreach}
                                            {else}
                                                 {$publication->getData('citationsRaw')|nl2br}
                                            {/if}
                                        </div>
                                    </div>
                                {/if}

                        </section><!-- .article-details -->
                </div><!-- .col-md-8 -->

        </div><!-- .row -->

</article>
