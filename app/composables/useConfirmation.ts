import { useConfirmDialog } from '@vueuse/core'

export function useConfirmation() {
  const { reveal, onConfirm, onCancel } = useConfirmDialog()

  return {
    show: (message: string) => {
      return new Promise<boolean>((resolve) => {
        reveal({ message })
        onConfirm(() => resolve(true))
        onCancel(() => resolve(false))
      })
    },
  }
}
