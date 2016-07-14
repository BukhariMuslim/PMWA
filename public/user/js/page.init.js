function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
		
$(function(){
	var center_form = $(".center-form"),
		date_picker = $('.datepicker'),
		select = $('select');
				
	if (center_form) {
		center_form.css({
			opacity: 1,
			"-webkit-transform": "scale(1)",
			"transform": "scale(1)",
			"-webkit-transition": ".5s",
			"transition": ".5s"
		});
	}
	
	if (date_picker) {
	    date_picker.pickadate({
	        labelMonthNext: 'Bulan berikutnya',
	        labelMonthPrev: 'Bulan sebelumnya',
	        labelMonthSelect: 'Pilih bulan',
	        labelYearSelect: 'Pilih tahun',
			monthsFull: [ 
				'Januari', 
				'Februari', 
				'Maret', 
				'April', 
				'Mei', 
				'Juni', 
				'Juli', 
				'Agustus', 
				'September', 
				'Oktober', 
				'November', 
				'December' 
			],
			monthsShort: [ 
				'Jan', 
				'Feb', 
				'Mar', 
				'Apr', 
				'Mei', 
				'Jun', 
				'Jul', 
				'Ags', 
				'Sep', 
				'Okt', 
				'Nov', 
				'Des' 
			],
			weekdaysFull: [ 
				'Minggu', 
				'Senin', 
				'Selasa', 
				'Rabu', 
				'Kamis', 
				'Jum\'at', 
				'Sabtu' 
			],
			weekdaysShort: [ 
				'Mig', 
				'Sen', 
				'Sel', 
				'Rab', 
				'Kam', 
				'Jum', 
				'Sab' 
			],
			weekdaysLetter: [
				'M',
				'S',
				'S',
				'R',
				'K',
				'J',
				'S'
			],
			selectMonths: true, // Creates a dropdown to control month
			selectYears: 100, // Creates a dropdown of 15 years to control year
			format: 'yyyy-mm-dd',
			//format: 'dd-mm-yyyy',
			formatSubmit: 'dd-mmm-yyyy',
			today: 'Hari Ini',
			clear: 'Hapus',
			close: 'Tutup',
		});
	}
	
	if (select) select.material_select();
});
