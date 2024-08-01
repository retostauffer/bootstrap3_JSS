{**
 * templates/frontend/components/jss_sponsors.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University Library
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @brief Common site navigation block with jss sponsors.
 *
 * @uses $requestedPage string Used to suppress one or another thing maybe.
 *}

	<h2 class="title">{translate|escape key="plugins.themes.bootstrap3JSS.sponsors"}</h2>
	    <div class="content">
	    <div class="row">
	        <div class="col-xs-4">
	                <a class="image-link" href="https://uibk.ac.at/", target="_new">
	                <img src="{$baseUrl}/plugins/themes/bootstrap3JSS/images/logos/uibk.png" />
	                </a>
	        </div>  
	        <div class="col-xs-4">
	                <a class="image-link" href="https://www.uzh.ch/", target="_new">
	                        <img src="{$baseUrl}/plugins/themes/bootstrap3JSS/images/logos/uzh.png" />
	                </a>
	        </div>  
	        <div class="col-xs-4">
	                <a class="image-link" href="https://ucla.edu/", target="_new">
	                        <img src="{$baseUrl}/plugins/themes/bootstrap3JSS/images/logos/ucla.png" />
	                </a>
	        </div>  
	    
	    </div> <!-- end .row -->
	</div> <!-- end .content -->
