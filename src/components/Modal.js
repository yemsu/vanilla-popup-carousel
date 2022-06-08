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
      this.setEvent(item, 'click', () => this.toggleActive())
    })
  }
  toggleActive() {
    const { isActive } = this.$state
    if(!isActive) {
      this.$target.classList.add('active')
      this.setState({ isActive: true })
    } else {
      this.$target.classList.remove('active')
      this.setState({ isActive: false })
    }
    console.log('toggleActive')
  }
}