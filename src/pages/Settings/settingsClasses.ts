const settingsClasses = {
  // Sidebar
  sidebarContainer: "w-128 bg-transparent p-4 flex flex-col justify-between",
  sidebarHeader: "flex items-center justify-center mb-8",
  sidebarHeaderLink: "text-3xl font-bold text-purple-600",
  sidebarMenu: "flex flex-col space-y-4 pl-16",
  sidebarMenuItem:
    "py-2 px-4 rounded-lg hover:bg-purple-600 hover:text-white dark:text-white tion-colors",
  sidebarFooter: "mt-auto text-gray-500 text-sm dark:text-gray-400",

  // Settings Page
  settingsPageContainer: "flex h-screen bg-gradient-to-r from-gray-300 to-gray-400 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-600",
  settingsPageContent: "flex flex-col flex-1 p-8",
  settingsPageHeader: "text-2xl font-bold mb-4 dark:text-white",

  // Settings Section
  settingsSection: "bg-white bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md",
  settingsSectionTitle: "text-lg font-bold mb-2 text-gray-800 dark:text-white",

  // Sidebar Icon Styles
  sidebarIconGradient: "sidebar-icon-gradient",
  sidebarTooltip: "sidebar-tooltip group-hover:scale-100",
  sidebarHr: "bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-500 rounded-full mx-2",
};

export default settingsClasses;
