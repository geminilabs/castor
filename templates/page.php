<?php

while (have_posts()) :
    the_post();
    Template::load('partials/page');
endwhile;
