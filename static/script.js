$(document).ready(function () {
    set_temp();
    show_comment();
});
function set_temp() {
    $.ajax({
        type: "GET",
        url: "http://spartacodingclub.shop/sparta_api/weather/palembang",
        data: {},
        success: function (response) {
            $('#temp').text(response['temp'])
        }
    })
}
function save_comment() {
    let name = $('#name').val().trim();;
    let comment = $('#comment').val().trim();;
    if (!name) {
        name = 'anonim';
    } 
    if (name.length > 50) {
        Swal.fire({
            title: 'Error',
            text: 'Nama tidak boleh lebih dari 50 karakter',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (!comment) {
        Swal.fire({
            title: 'Error',
            text: 'Pesan wajib diisi',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    if (comment.length > 100) {
        Swal.fire({
            title: 'Error',
            text: 'Pesan tidak boleh lebih dari 100 karakter',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    let spinner = new Spinner().spin();
     $('#loading').append(spinner.el);

    $.ajax({
        type: 'POST',
        url: '/fanbook',
        data: {
            name_give: name,
            comment_give: comment,
        },
        success: function (response) {
            spinner.stop();
            Swal.fire({
                title: 'Success',
                text: response['msg'],
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }
    })
}

function show_comment() {
    $('#comment-list').empty();
    $.ajax({
        type: "GET",
        url: "/fanbook",
        data: {},
        success: function (response) {
            let messages = response['comments'];

            if (messages.length === 0) {
                $('#comment-list').html('<div class="card"><div class="card-body">Data masih kosong</div></div>');
                return;
            }

            for (let i = 0; i < messages.length; i++) {
                let name = messages[i]['name'];
                let comment = messages[i]['comment'];
                let temp_html = `
                    <div class="card">
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                                <p>${comment}</p>
                                <footer class="blockquote-footer">${name}</footer>
                            </blockquote>
                        </div>
                    </div>
                `;

                $('#comment-list').append(temp_html);
            }
        }
    });
}
