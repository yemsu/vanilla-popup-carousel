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
    const { dataList } = this.$props
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
    const modalOpenButtons = carouselMain.$target.querySelectorAll('.slide > button')
    modalOpenButtons.forEach(button => {
      this.setEvent(button, 'click', async () => {
        const { isPopupRendered } = this.$state
        if(isPopupRendered) return false
        this.setState({ isPopupRendered: true })
        this.setStateSubCarouselModal(modalOpenButtons, dataList)
        .then(() => this.setEventSubCarouselModal())
      })
    })

  }
  async setStateSubCarouselModal(openButtons, dataList) {
    // Make Instance
      // - modal
    const targetPostModal = newElement('div', 'modal-carousel')
    this.$target.appendChild(targetPostModal)
    const modal = await new Modal(targetPostModal, { openButtons })   
      // - sub carousel
    const carouselSub = await new Carousel(modal.$contentsArea, {
      dataList: this.setupModalCarouselData(dataList),
    })
    // Set State
    this.setState({
      carouselSub,
      modal
    })
  }
  setupModalCarouselData(dataHasModal) {
    return dataHasModal.map(({ modal }) => ({
      tit: modal.tit,
      img: modal.pcLink,
      alt: modal.alt,
      description: modal.script,
    }))
  }    
  setEventSubCarouselModal() {
    const { carouselMain, carouselSub, modal } = this.$state
    // modal 오픈할때 sub carousel - main carousel 인덱스 동기화
    modal.afterActive = () => this.synchronizeIndex(carouselMain, carouselSub)
    // main - sub carousel 연동
    this.twinPlayCarousel(carouselMain, carouselSub)
    // open modal
    modal.toggleActive()
  }
  synchronizeIndex(carouselMain, carouselSub) {
    const { activeIndex: mainActiveIndex } = carouselMain.$state
    const { activeIndex: subActiveIndex } = carouselSub.$state
    subActiveIndex !== mainActiveIndex
    && carouselSub.runActiveIndexChange(mainActiveIndex)
  }
  twinPlayCarousel(carouselMain, carouselSub) {
    mutationObserver(carouselMain.$target, (mutation) => {
      const { isActive } = this.$state.modal.$state
      const { activeIndex } = carouselMain.$state
      if(!isActive) return 
      const { attributeName } = mutation
      if(attributeName === "data-index") {
        carouselSub.runActiveIndexChange(activeIndex)
      }
    })
  }
}