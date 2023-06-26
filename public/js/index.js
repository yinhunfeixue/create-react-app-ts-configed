const element = document.getElementById('dmpIndexPage')
const showLoading = !Boolean(window.opener)
if (showLoading && element) {
    element.innerHTML = `
    <div class="loading">
        <img class="imgLoading" src="../assets/indexPageLoading.gif" />
        <div class="Title">DOP 数据治理运营平台</div>
        <div class="Footer">量之智能，实现了数据治理实施领域的所有功能，让数据治理不再是件麻烦事儿</div>
    </div>
  `
}
