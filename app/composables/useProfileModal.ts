export function useProfileModal() {
  const isOpen = useState<boolean>('mangile-profile-modal-open', () => false)
  const { isMobile } = useDevice()
  const globalSidebarOpen = useSidebar()

  function openProfile() {
    const isMobileScreen = isMobile || (import.meta.client && window.innerWidth < 768)
    if (isMobileScreen) {
      globalSidebarOpen.value = false
      navigateTo('/profile')
    } else {
      isOpen.value = true
    }
  }

  function closeProfile() {
    isOpen.value = false
  }

  function toggleProfile() {
    if (isOpen.value) {
      closeProfile()
    } else {
      openProfile()
    }
  }

  return {
    isOpen,
    openProfile,
    closeProfile,
    toggleProfile
  }
}
