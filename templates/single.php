<?php

while (have_posts()) :
    the_post();
    Template::load('partials/single', get_post_type());
    Template::load('partials/prev-next', get_post_type());
    comments_template('/templates/partials/comments.php');
endwhile;
