import Component from "@/core/Component";
import TwinCarouselModal from "@/components/TwinCarouselModal";
import { getPosts } from '@/utils/Http'

class App extends Component{
  async setup() {
    const { data: dataPosts1  } = await getPosts('posts1')
    const { data: dataPosts2  } = await getPosts('posts2')
    this.$state = {
      dataPosts1,
      dataPosts2,
    }
  }
  mounted() {
    new TwinCarouselModal(this.$target, {
      dataList: this.$state.dataPosts1
    })
    new TwinCarouselModal(this.$target, {
      dataList: this.$state.dataPosts2
    })
  }
}

export default App
