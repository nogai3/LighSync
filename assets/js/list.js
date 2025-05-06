document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('#menu > li');

    menuItems.forEach(item => {
        const submenu = item.querySelector('ul');
        if (submenu) {
            item.addEventListener('mouseenter', () => {
                submenu.style.display = 'block';
            });
            item.addEventListener('mouseleave', () => {
                submenu.style.display = 'none';
            });
        }
    });
});
