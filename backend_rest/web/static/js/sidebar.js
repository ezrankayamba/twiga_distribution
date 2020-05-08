(function () {
  let sidebar = document.querySelector(".sidebar");
  let sidebarContent = document.querySelector(".sidebar-content");
  let sidebarClose = document.querySelector(".sidebar-close");
  let toggle = document.querySelector(".sidebar-menu-toggle");
  let menuShow = false;
  const hideCompleted = () => {
    sidebar.classList.remove("show");
    sidebar.removeEventListener("animationend", hideCompleted);
  };

  const open = () => {
    sidebar.classList.remove("slideOutLeft");
    sidebar.classList.add("slideInLeft");
    sidebar.classList.add("show");
  };
  const close = () => {
    sidebar.classList.add("slideOutLeft");
    sidebar.classList.remove("slideInLeft");
    sidebar.addEventListener("animationend", hideCompleted);
  };
  console.log(sidebar, toggle);
  if (sidebar && toggle) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menuShow = !menuShow;
      sidebar.classList.remove("show");
      if (menuShow) {
        open();
      }
    });
    sidebar.addEventListener("click", (e) => {
      e.stopPropagation();
      menuShow = false;
      close();
    });
  }
  if (sidebarContent) {
    sidebarContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
  if (sidebarClose) {
    sidebarClose.addEventListener("click", (e) => {
      e.stopPropagation();
      menuShow = false;
      close();
    });
  }

  let menus = document.querySelectorAll(".sidebar-menu li");
  if (menus) {
    const selected = (menu) => {
      menus.forEach((menu) => menu.classList.remove("active"));
      menu.classList.add("active");
    };
    menus.forEach((menu) => {
      menu.addEventListener("click", (e) => selected(menu));
    });
  }
  console.log("Loaded...");
})();
