import Component from '@/core/Component'
import Carousel from '@/components/Carousel'
import Modal from '@/components/Modal'
import { newElement } from '@/utils'
import { mutationObserver } from '@/utils/observer'
import '@/scss/components/TwinCarouselModal.scss'

export default class TwinCarouselModal extends Component {
  setup() {
    this.$state = {
      isPopupRendered: false
    }
  }
  template() {
    const TwinCarouselModal = newElement('div', 'carousel-twin-modal')
    return TwinCarouselModal
  }
  async mounted() {
    const {dataList} = this.$props
    // Main Carousel Instance
    const targetCarouselPosts1 = newElement('div', 'carousel-main')
    this.$target.appendChild(targetCarouselPosts1)
    const carouselMain = await new Carousel(targetCarouselPosts1, {
      dataList,
      type: 'center',
      slideNumPerView: 3
    })
    this.setState({
      carouselMain
    })
    // slide click => popup render
    const slideButtons = carouselMain.$target.querySelectorAll('.slide > button')
    slideButtons.forEach(button => {
      this.setEvent(button, 'click', async () => {
        const { isPopupRendered } = this.$state
        if(isPopupRendered) return
        this.setState({ isPopupRendered: true })
        // Modal Carousel Template
        this.returnTemplateModal(slideButtons, dataList)
      })
    })

    // observer
    mutationObserver(carouselMain.$target, (mutation) => {
      const { modal } = this.$state
      if(!modal.$state.isActive) return 
      const { attributeName } = mutation
      if(attributeName === "data-index") {
        const { carouselSub } = this.$state
        carouselSub.domHandler(carouselMain.$state.activeIndex)
      }
    })
  }
  async returnTemplateModal(openButtons, dataList) {
    // Modal Instance
    const targetPostModal = newElement('div', 'modal-carousel')
    this.$target.appendChild(targetPostModal)
    const modal = await new Modal(targetPostModal, { openButtons })    
    // Sub Carousel Instance
    const setupModalCarouselData = (dataHasModal) => {
      return dataHasModal.map(({ modal }) => ({
        tit: modal.tit,
        img: modal.pcLink,
        alt: modal.alt,
        description: modal.script,
      }))
    }    
    const carouselSub = new Carousel(modal.$contentsArea, {
      dataList: setupModalCarouselData(dataList),
    })
    // Modal Open
    modal.toggleActive()
    modal.afterActive = () => {
      const { carouselMain } = this.$state
      const mainActiveIndex = carouselMain.$state.activeIndex
      const checkActiveIndex = carouselSub.$state.activeIndex !== mainActiveIndex
      
      checkActiveIndex && carouselSub.domHandler(mainActiveIndex)
    }
    // Set State
    this.setState({
      carouselSub,
      modal
    })
  }
}