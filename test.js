window.onload = function () {
	enableColorPicker();
};	

function enableColorPicker() {
	var myColor = "#FFFFFF";
	console.log(myColor);
   // $(function(){
   
   
    	$('.demo2').colorpicker({"input" : null, "color" : "blue"}).on("changeColor", function (event) {
    		myColor = event.color.toHex();
    		console.log(event.color.toHex());
    	})
   	 console.log(myColor);     
   // });
}