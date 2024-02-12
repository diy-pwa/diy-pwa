<?php
/*
Plugin Name: diy-pwa
*/

add_action('admin_init', function(){
    remove_meta_box('dashboard_primary', 'dashboard', 'normal'); //Removes the 'WordPress News' widget
    remove_meta_box('dashboard_quick_press', 'dashboard', 'side'); //Removes the 'Quick Draft' widget
    remove_meta_box('dashboard_site_health', 'dashboard', 'normal'); // Remove site health wizard
});




