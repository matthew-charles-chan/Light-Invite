
$(document).ready(function() {

  const $updateInfo = $("#updateInfo");
  $updateInfo.click(()=> {
    if($('#updateSection').hasClass("visable")) {
      $('#updateSection').removeClass("visable")
    } else {
      $('#updateSection').addClass("visable")
    }
  })

});
