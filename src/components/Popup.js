import Component from '@/core/Component'
class Popup extends Component {
  async setup() {
    this.$state = {
      isActive: false
    }
  }
  template() {
    const popup = document.createElement('div')
    popup.classList.add('popup')
    popup.innerHTML = `
      <div class="wrap-contents"></div>
      <button data-popup-close>
        <span class="ir-hidden">닫기</span>
      </button>
    `
    return popup
  }
  setNodeSelector() {
    this.$el.contentsArea = this.$template.querySelector('.wrap-contents')
  }
  mounted() {
    console.log('mounted')
  }x
  setEvent() {
    // const { nodeContents } = this.$props
    // console.log('setEvents',  this.$el.querySelector('.wrap-contents'))
    // this.$el.querySelector('.wrap-contents').appendChild(nodeContents)
  }
}

export default Popup