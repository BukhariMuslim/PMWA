$("#tambahUser").click(function(){
	var username = $("#username").val();
	var password = $("#password").val();
	$.ajax({
		data: "username="+username+"&password="+password,
		type: 'POST',
		url: "/admin/addUser",
		success: function(data, status, xhr){
			alert("User created");
			location.reload();
		},
		error: function (error) {
			if(error.status===409){
				alert("Duplicate username");
				location.reload();
			}
		}
	});
});

$("#tambahPost").click(function(){
	var title = $("#title").val();
	var content = $("#contentPost").val();
	$.ajax({
		data: "title="+title+"&content="+content,
		type: 'POST',
		url: "/admin/addPost",
		success: function(data, status, xhr){
			alert("Post created");
			location.reload();
		}
	});
});

$(".deleteUser").click(function(){
	$.ajax({
		url: '/admin/user/'+this.id,
		type: 'DELETE',
		success: function(result){
			alert('User deleted!');
			location.reload();
		}
	});
	location.reload();
});

$(".deletePost").click(function(){
	$.ajax({
		url: '/admin/post/'+this.id,
		type: 'DELETE',
		success: function(result){
			alert('Post deleted!');
			location.reload();
		}
	});
	location.reload();
});