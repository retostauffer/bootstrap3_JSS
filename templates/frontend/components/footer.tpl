{**
 * templates/frontend/components/footer.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Common site frontend footer.
 *
 * @uses $isFullWidth bool Should this page be displayed without sidebars? This
 *       represents a page-level override, and doesn't indicate whether or not
 *       sidebars have been configured for thesite.
 * @uses $requestedPage string Used to suppress one or another thing maybe.
 * @uses $webfeedData something defined by theme init method.
 *}

        </main>

        {* Sidebars *}
	<!--
        $requestedPage: {$requestedPage}
	-->

        {if empty($isFullWidth)}

                {capture assign="sidebarCode"}{call_hook name="Templates::Common::Sidebar"}{/capture}

                <aside id="sidebar" class="pkp_structure_sidebar left col-sm-12 col-md-4" role="complementary" aria-label="{translate|escape key="common.navigation.sidebar"}">

		<div class="sidebar-separator hidden-md hidden-lg"></div>

		{* Custom transition note *}
		{include file="frontend/components/jss_transition_note.tpl"}

                {if $requestedPage != "article"}
                	<div class="pkp_block" id="jss-publisher-list">
                		{include file="frontend/components/jss_publisher_info.tpl"}
			</div>
                {/if}

              	{include file="frontend/components/role_dependent_navigation.tpl"}

                {$sidebarCode}

                {if $requestedPage == "index"}
			{* Note: only works on index as loaded by PKPIndexHandler class *}
                	<div class="pkp_block" id="jss-announcement-list">
                	    	{include file="frontend/components/announcement_list.tpl"}
                	</div>
		{/if}

                {if $requestedPage != "article"}
                	<div class="pkp_block jss-sponsors">
                		{include file="frontend/components/jss_sponsors.tpl"}
                	</div>

                {/if}

                {if $requestedPage != "article"}
			<div class="pkp_block jss-foas">
                		{include file="frontend/components/jss_foas.tpl"}
			</div>
		{/if}

                {* CUSTOM BLOCKS ONLY SHOWN IF NOT ARTICLE VIEW *}
		{if $requestedPage == "article" && $citation}
			<div class="pkp_block how-to-cite">
				<h2 class="title">
					{translate key="submission.howToCite"}
				</h2>
				<div class="content">
					<div id="citationOutput" role="region" aria-live="polite">
						{$citation}
					</div>

					<div class="btn-group">
					  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-controls="cslCitationFormats">
					  	{translate key="submission.howToCite.citationFormats"}
					  	<span class="caret"></span>
					  </button>

					  <ul class="dropdown-menu" role="menu">
					  	{foreach from=$citationStyles item="citationStyle"}
					  		<li>
					  			<a aria-controls="citationOutput"
					  			   href="{url page="citationstylelanguage" op="get" path=$citationStyle.id params=$citationArgs}"
					  			   data-load-citation
					  			   data-json-href="{url page="citationstylelanguage" op="get" path=$citationStyle.id params=$citationArgsJson}">
					  				{$citationStyle.title|escape}
					  			</a>
					  		</li>
					  	{/foreach}
					  </ul>         
					</div>

					{if !empty($citationDownloads)}
					<div class="btn-group">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-controls="cslCitationFormats">
							{translate key="submission.howToCite.downloadCitation"}
							<span class="caret"></span>
						</button>
					{* Download citation formats *}
					<ul class="dropdown-menu" role="menu">
						{foreach from=$citationDownloads item="citationDownload"}
							<li>
								<a href="{url page="citationstylelanguage" op="download" path=$citationDownload.id params=$citationArgs}">
									<span class="fa fa-download"></span>
									{$citationDownload.title|escape}
								</a>
							</li>
						{/foreach}
					</ul>           
					</div>
					{/if}
				</div>
			</div>
		{/if}

                {if $requestedPage == "article" && ($licenseTerms || $licenseUrl)}
                	<div class="pkp_block" id="jss-copyright">
				{include file="frontend/components/jss_copyright.tpl"}
			</div>
                {/if}

                </aside><!-- pkp_sidebar.left -->
        {/if}
        </div><!-- pkp_structure_content -->

        <footer class="footer" role="contentinfo">

                <div class="container">

                        <div class="row">
                                <div class="col-sm-12 col-md-5">
					<strong>{translate|escape key="plugins.themes.bootstrap3JSS.footermenutitle"}</strong>
                                        {capture assign="footerMenu"}
                                                {load_menu name = "footerMenu" class="jss-footer-menu" ulClass='footer-menu'}
                                        {/capture}
                                        {$footerMenu}
					<div class="webfeed_footer">
						<a href="{$baseUrl}/atom" target="_new">
							<img src="{$baseUrl}/lib/pkp/templates/images/atom.svg" alt="Atom logo">
						</a>
						<a href="{$baseUrl}/atom" target="_new">
							<img src="{$baseUrl}/lib/pkp/templates/images/rss20_logo.svg" alt="RSS2 logo">
						</a>
					</div>
                                </div>
                                <div class="col-sm-12 col-md-5">
					<strong>{translate|escape key="plugins.themes.bootstrap3JSS.footermenutitleexternal"}</strong>
                                        {capture assign="footerMenuExternal"}
                                                {load_menu name = "footerMenuExternal" class="jss-footer center" ulClass='footer-menu center'}
                                        {/capture}
                                        {$footerMenuExternal}

                                </div>

                                <div class="col-sm-12 col-md-2 pkpinfo" role="complementary">

                                        <a href="{url page="about" op="aboutThisPublishingSystem"}">
                                                <img class="img-responsive" alt="{translate key="about.aboutThisPublishingSystem"}" src="{$baseUrl}/{$brandImage}">
                                        </a>
                                </div>

                        </div> <!-- .row -->
                </div><!-- .container -->
        </footer>
</div><!-- pkp_structure_page -->

{load_script context="frontend" scripts=$scripts}

{call_hook name="Templates::Common::Footer::PageFooter"}
</body>
</html>
