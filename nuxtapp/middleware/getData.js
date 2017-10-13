/**
 * Created by chenzhe on 17/8/25.
 */
import axios from 'axios'

export default function ({context}) {

  console.log(1);
  return axios.get('http://www.fz-ark.com/facade-web/course/list-complex?timeseq=1503652514007&csrfKey=undefined&tag=1001&name=&pagination.currentPage=1&pagination.pageSize=10')
    .then(function (response) {
    console.log('1.1');
      // console.log(response);
  })
}
