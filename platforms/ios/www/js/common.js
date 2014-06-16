function verifMail(mail_value, id_page){
	var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;

	if(mail_value == ''){
		$('#'+id_page+' .mail.error_needed').css('display', 'block');
		return false;
	}
	else if (!pattern.test(mail_value)){
		$('#'+id_page+' .mail.error_pattern').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .mail.error').css('display', 'none');
		return true;
	}
};

function verifPassword(pwd_value, id_page){
	if(pwd_value == ''){
		$('#'+id_page+' .password.error_needed').css('display', 'block');
		return false;
	}else if(pwd_value.length < 6){
		$('#'+id_page+' .password.error_length').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .password.error').css('display', 'none');
		return true;
	}
};

function verifFirstName(first_value, id_page){
	if(first_value == ''){
		$('#'+id_page+' .firstname.error_needed').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .firstname.error').css('display', 'none');
		return true;
	}
};

function verifLastName(last_value, id_page){
	if(last_value == ''){
		$('#'+id_page+' .lastname.error_needed').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .lastname.error').css('display', 'none');
		return true;
	}
};

function verifPhone(phone_value, id_page){
var pattern = /^\b[0-9]{9,11}\b$/i;

	if(phone_value == ''){
		$('#'+id_page+' .phone.error_needed').css('display', 'block');
		return false;
	}
	else if (!pattern.test(phone_value)){
		$('#'+id_page+' .phone.error_pattern').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .phone.error').css('display', 'none');
		return true;
	}
};

function verifAddress(address_value, id_page){
	if(address_value == ''){
		$('#'+id_page+' .address.error_needed').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .address.error').css('display', 'none');
		return true;
	}
};

function verifEntitle(title_value, id_page){
	if(title_value == ''){
		$('#'+id_page+' .entitled.error_needed').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .entitled.error').css('display', 'none');
		return true;
	}
};

function verifDate(date_value, id_page){
	var pattern = /^\b[0-9]{4}\/[0-9]{2}\/[0-9]{2}\b$/i;

	if(date_value == ''){
		$('#'+id_page+' .date.error_needed').css('display', 'block');
		return false;
	}
	else if (!pattern.test(date_value)){
		$('#'+id_page+' .date.error_pattern').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .date.error').css('display', 'none');
		return true;
	}
};

function verifDetails(details_value, id_page){
	if(details_value == ''){
		$('#'+id_page+' .details.error_needed').css('display', 'block');
		return false;
	}
	else{
		$('#'+id_page+' .details.error').css('display', 'none');
		return true;
	}
};

function clickButtonVerif(button) {
	var id_page = $(button).closest('.page')[0].id;
	var havetosend = true;
	$('#' + id_page + ' .error').css('display', 'none');

	$("#" + id_page + " :input").each(function(){
		var elements=$(this);
		var el = elements[0];
		(function(el){
			if(el.placeholder == 'Mail'){
				if(!verifMail(el.value, id_page)){
					havetosend = false;
				}
			}
			if(el.placeholder == 'Password'){
				if(!verifPassword(el.value, id_page)){
					havetosend = false;
				}
			}
			if(el.placeholder == 'First name'){
				if(!verifFirstName(el.value, id_page)){
					havetosend = false;
				}
			}

			if(el.placeholder == 'Last name'){
				if(!verifLastName(el.value, id_page)){
					havetosend = false;
				}
			}
			if(el.placeholder == 'Phone'){
				if(!verifPhone(el.value, id_page)){
					havetosend = false;
				}
			}

			if(el.placeholder == 'Address'){
				if(!verifAddress(el.value, id_page)){
					havetosend=false;
				}
			}

			if(el.placeholder == 'Entitled'){
				if(!verifEntitle(el.value, id_page)){
					havetosend=false;
				}
			}

			if(el.placeholder == 'Date'){
				if(!verifDate(el.value, id_page)){
					havetosend=false;
				}
			}
			if(el.placeholder == 'Details'){
				if(!verifDetails(el.value, id_page)){
					havetosend=false;
				}
			}
		})(el);
	});

	return havetosend; 
};

function avoidForm(id_page){
	$("#" + id_page + " :input").each(function(){
		this.value='';
	});
};

$('.return').click(function(){
	HISTORY.back();
});

