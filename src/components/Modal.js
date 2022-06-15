import Component from '@/core/Component'
import '@/scss/components/Modal.scss'

export default class Model extends Component {
  $contentsArea
  async setup() {
    this.setDefaultProps({ 
      openButtons: [],
    })

    this.$state = {
      isActive: false
    }
  }
  template() {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.innerHTML = `
      <div class="wrap-contents"></div>
      <button class="button-close" data-modal-close>
        <span class="ir-hidden">닫기</span>
      </button>
    `
    return modal
  }
  mounted() {
    this.$contentsArea = this.$target.querySelector('.wrap-contents')
    console.log('mounted')

    const { openButtons } = this.$props
    const closeButton = this.$target.querySelector('[data-modal-close]')
    const toggleButtons = [...openButtons, closeButton]
    toggleButtons.forEach(item => {
      const isCloseButton = item.classList.value.includes('close')
      const openPopup = isCloseButton ? false : true
      this.setEvent(item, 'click', () => this.toggleActive(openPopup))
    })
  }
  toggleActive(isOpen) {
    const { isActive } = this.$state
    const checkOpen = isOpen ?? !isActive
    if(checkOpen) {
      this.$target.classList.add('active')
      this.setState({ isActive: true })
      this.afterActive()
    } else {
      this.$target.classList.remove('active')
      this.setState({ isActive: false })
    }
  }
  afterActive() {

  }
}