export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'indigo',
      success: 'emerald',
      info: 'blue',
      warning: 'amber',
      error: 'rose',
      neutral: 'slate'
    },
    button: {
      slots: {
        base: 'rounded-(--os-btn-radius) font-semibold active:scale-(--os-press-scale) transition-[transform,background-color,border-color,color,box-shadow] duration-150'
      }
    },
    badge: {
      slots: {
        base: 'rounded-(--os-badge-radius) font-semibold'
      }
    },
    input: {
      slots: {
        base: 'rounded-(--os-input-radius) transition-[border-color,box-shadow,background-color] duration-150'
      }
    },
    textarea: {
      slots: {
        base: 'rounded-(--os-input-radius) transition-[border-color,box-shadow,background-color] duration-150'
      }
    },
    select: {
      slots: {
        base: 'rounded-(--os-input-radius) transition-[border-color,box-shadow,background-color] duration-150',
        content: 'os-popover-surface'
      }
    },
    card: {
      slots: {
        root: 'os-card rounded-(--os-card-radius)'
      }
    },
    modal: {
      slots: {
        overlay: 'bg-black/45 backdrop-blur-[2px]',
        content: 'os-modal-surface rounded-(--os-modal-radius)'
      }
    },
    popover: {
      slots: {
        content: 'os-popover-surface rounded-(--os-popover-radius)'
      }
    },
    dropdownMenu: {
      slots: {
        content: 'os-popover-surface rounded-(--os-popover-radius)'
      }
    },
    tooltip: {
      slots: {
        content: 'os-popover-surface rounded-lg text-xs font-medium'
      }
    }
  }
})
