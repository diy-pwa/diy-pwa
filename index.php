<?php
/*
Plugin Name: diy-pwa
*/

add_action('admin_init', function(){
    remove_meta_box('dashboard_primary', 'dashboard', 'normal'); //Removes the 'WordPress News' widget    
});




