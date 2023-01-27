const API_URL = 'http://localhost:4000/api';

// POST semua data ke database
getData = () => {
    fetch('./data.json')
        .then((response) => response.json())
        .then((json) => {
            json.forEach(data => {
                // console.log(JSON.stringify(data));
                fetch(`${API_URL}/data_toko`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(response => response.text)
                    .then(result => {
                        document.getElementById('belanja').setAttribute('hidden', 'hidden')
                        show()
                    })
            })
        });
}

// Menampilkan data
show = () => {
    fetch(`${API_URL}/data_toko`, {
        method: 'GET'
    })
        .then((data) => {
            return data.json();
        })
        .then((objectData) => {
            let toko = "";
            let checkout = "";
            let finalHarga = 0;
            let totalJumlah = 0;
            let totalHarga = 0;
            let totalDiskon = 0;

            if (objectData.length != 0) {
                document.querySelector('#keranjang').removeAttribute('hidden')
                document.querySelector('#keranjang-del').removeAttribute('hidden')
            }

            objectData.map((values, idx) => {
                let eachbarang = "";
                values.barang.forEach(e => {

                    if (e.isCheck) {
                        totalJumlah += e.jumlah;
                        totalHarga += (e.jumlah * e.harga);
                        totalDiskon += diskon((e.jumlah * e.harga), e.diskon)
                    }

                    eachbarang += `
                        <div data-key=${e._id} class="d-flex flex-wrap checkBarang" >
                            <div class="checkbox-container">
                                <div>
                                    ${e.isCheck ?
                            `<i class="bi-checkBarang bi bi-check-square-fill"></i>`
                            :
                            `<i class="bi-checkBarang bi bi-check-square"></i>`
                        }
                                </div>
                                <div>
                                    <img src="${e.gambar}" width='120' class='img-style' alt=""/>
                                </div>
                            </div>
                            <div class="col-md-8 details d-flex">
                                <div class="d-block">${e.nama}</div>
                                <div class="d-block">
                                ${e.diskon != 0 ?
                            `<span class="diskonBox">${e.diskon}%</span><span class="diskonLabel">Rp${formatRupiah(e.harga)}</span><span class="price">Rp${formatRupiah(e.harga - diskon(e.harga, e.diskon))}</span>` :
                            `Rp ${formatRupiah(e.harga)}`
                        }
                                </div>
                                <div class="d-flex">
                                    <div class="plusminus">
                                        <i class="btn-minus bi bi-dash-circle"></i>
                                    </div>
                                    <div class="plusminus">
                                        <span class="quantity">${e.jumlah}</span>
                                    </div>
                                    <div class="plusminus">
                                        <i class="btn-add bi bi-plus-circle"></i>
                                    </div>
                                </div>
                                <i class="bi bi-trash"></i>
                            </div>
                        </div>
                    `;
                })

                toko += `
                        <div data-key=${values._id} class="checkToko">
                            <div class="toko d-flex">
                                <div class="col-md-auto">
                                    ${values.isCheck ?
                        `<i class="bi-checkToko bi bi-check-square-fill"></i>` :
                        `<i class="bi-checkToko bi bi-check-square"></i>`
                    }
                                </div>
                                <div class="col-md-9">
                                    <span>${values.toko}</span>
                                </div>

                                ${values.isCheck ?
                        `<div class="col-md-auto">` :
                        `<div class="col-md-auto" hidden>`
                    }
                                    <button class="btn-delete" style="font-weight:600">Hapus Toko</button>
                                </div>
                            </div>
                            <div class="toko-barang">
                                ${eachbarang}
                            </div>
                        </div>
                `;
            });

            finalHarga += totalHarga - totalDiskon
            checkout += `
                    <div class='p-3 test21'}>
                        <div class='fs-3' >Total Harga</div>
                        <div class='fs-2 text-center mb-4'>
                            <span>Rp </span>${formatRupiah(finalHarga)}
                        </div>
                        <div class='row'>
                            <div class="col">
                                Jumlah Barang <br />
                                Total Harga <br />
                                Total Diskon
                            </div>
                            <div class="col">
                                ${totalJumlah} barang<br />
                                Rp${formatRupiah(totalHarga)}<br />
                                -Rp${formatRupiah(totalDiskon)}
                            </div>
                            <div class='fs-3 mt-4'>
                                <button class='btn' type="button">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
            `;

            document.getElementById("content").innerHTML = toko

            // menyembunyikan content untuk "Mari Belanja"
            document.getElementById("boxed").removeAttribute('hidden')
            document.getElementById("boxed").innerHTML = checkout
        })
}

// mengubah menjadi format rupiah
formatRupiah = (harga) => {
    let reverse = harga.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    return ribuan = ribuan.join('.').split('').reverse().join('');
}

// menghitung diskon
diskon = (harga, diskon) => {
    let disc = harga * (diskon / 100)
    return disc
}

// update checkbox toko dan anak2 nya 
updateToko = (idToko, kondisi) => {
    fetch(`${API_URL}/data_toko/${idToko}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCheck: !kondisi }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(result => {
            result.barang.forEach(data => {
                fetch(`${API_URL}/data_toko/${idToko}/${data._id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ isCheck: !kondisi }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then(response => response.text)
                    .then(result => {
                        show()
                    })
            })
        })
}

// update checkbox barang
updateBarang = (idToko, idBarang, data) => {
    fetch(`${API_URL}/data_toko/${idToko}/${idBarang}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.text)
        .then(result => {
            show()
        })
}

// delete semua toko
deleteAllToko = () => {
    fetch(`${API_URL}/data_toko`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.text)
        .then(result => {
            check()
        })
}

// delete toko
deleteToko = (idToko) => {
    fetch(`${API_URL}/data_toko/${idToko}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.text)
        .then(result => {
            check()
        })
}

// delete barang
deleteBarang = (idToko, idBarang) => {
    fetch(`${API_URL}/data_toko/${idToko}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(dataToko => {
            if (dataToko.barang.length == 1) {
                deleteToko(idToko)
            }
            else {
                fetch(`${API_URL}/data_toko/${idToko}/${idBarang}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(response => response.text)
                    .then(dataBarang => {
                        show()
                    })
            }
            // console.log(dataToko.barang.length);
        })
}

// dialog delete toko
dialogDeleteToko = (idToko, tokoele) => {
    document.querySelector('#dialog-label').textContent = 'Hapus Toko?';
    document.querySelector('#dialog-text').textContent = 'Toko yang kamu pilih akan dihapus dari keranjang.';

    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#dialog').style.display = 'block';

    document.getElementById('button-confirm').addEventListener('click', e => {
        tokoele.remove()
        deleteToko(idToko)

        document.getElementById('overlay').style.display = 'none';
        document.getElementById('dialog').style.display = 'none';
    });

    document.getElementById('button-cancel').addEventListener('click', e => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('dialog').style.display = 'none';
    });
}

// dialog delete keranjang
dialogDeleteAll = () => {
    document.querySelector('#dialog-label').textContent = 'Hapus Keranjang?';
    document.querySelector('#dialog-text').textContent = 'Semua toko dan barang akan dihapus dari keranjang.';

    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#dialog').style.display = 'block';

    document.getElementById('button-confirm').addEventListener('click', e => {
        let contentDiv = document.querySelector('#content');
        let tokosDiv = contentDiv.querySelectorAll('.checkToko');

        tokosDiv.forEach(toko => {
            toko.remove()
        })

        deleteAllToko()

        document.getElementById('overlay').style.display = 'none';
        document.getElementById('dialog').style.display = 'none';
    });

    document.getElementById('button-cancel').addEventListener('click', e => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('dialog').style.display = 'none';
    });
}


// Fungsi pertama yang dipanggil untuk check kondisi barang apakah sudah ada atau tidak
check = () => {
    fetch(`${API_URL}/data_toko`, {
        method: 'GET'
    })
        .then((response) => response.json())
        .then((json) => {
            let length = json.length;
            if (length != 0) {
                show()
            } else {
                document.getElementById('belanja').removeAttribute('hidden')
                document.getElementById('boxed').setAttribute('hidden', 'hidden')
                document.querySelector('#keranjang').setAttribute('hidden', 'hidden')
                document.querySelector('#keranjang-del').setAttribute('hidden', 'hidden')
            }
        });
}

check()


// Fungsi2 click :)
const contentBox = document.querySelector('#container')
contentBox.addEventListener('click', e => {
    // btnMinus
    if (e.target.classList.contains('btn-minus')) {
        const keyToko = e.target.closest('.checkToko').dataset.key;
        const keyBarang = e.target.closest('.checkBarang').dataset.key;

        let form = e.target.closest('.d-flex');
        let quantity = form.querySelector('.quantity');
        let currentQuantity = parseInt(quantity.textContent);
        if (currentQuantity > 0) {
            quantity.textContent = currentQuantity - 1;
            currentQuantity = parseInt(quantity.textContent);
        }

        let data = { jumlah: currentQuantity };
        updateBarang(keyToko, keyBarang, data)
    }

    // btnAdd
    if (e.target.classList.contains('btn-add')) {
        const keyToko = e.target.closest('.checkToko').dataset.key;
        const keyBarang = e.target.closest('.checkBarang').dataset.key;

        let form = e.target.closest('.d-flex');
        let quantity = form.querySelector('.quantity');
        let currentQuantity = parseInt(quantity.textContent);
        if (currentQuantity < 7) {
            quantity.textContent = currentQuantity + 1
            currentQuantity = parseInt(quantity.textContent);
        }

        let data = { jumlah: currentQuantity };
        updateBarang(keyToko, keyBarang, data)
    }

    // checkBox Toko
    if (e.target.classList.contains('bi-checkToko')) {
        const keyToko = e.target.closest('.checkToko').dataset.key;

        const classCheck = e.target.closest('.bi-checkToko').classList[2];
        const checked = (classCheck == 'bi-check-square-fill') ? true : false;
        updateToko(keyToko, checked);
    }

    // checkBox Barang
    if (e.target.classList.contains('bi-checkBarang')) {
        const keyToko = e.target.closest('.checkToko').dataset.key;
        const keyBarang = e.target.closest('.checkBarang').dataset.key;

        const classCheck = e.target.closest('.bi-checkBarang').classList[2];
        const checked = (classCheck == 'bi-check-square-fill') ? true : false;

        const data = { isCheck: !checked }
        updateBarang(keyToko, keyBarang, data);
    }

    // btnHapus by barang
    if (e.target.classList.contains('bi-trash')) {
        const keyToko = e.target.closest('.checkToko').dataset.key;
        const keyBarang = e.target.closest('.checkBarang').dataset.key;

        deleteBarang(keyToko, keyBarang);
    }

    // btnHapus by toko
    if (e.target.classList.contains('btn-delete')) {
        const toko = e.target.closest('.checkToko');
        const keyToko = e.target.closest('.checkToko').dataset.key;

        dialogDeleteToko(keyToko, toko)
    }

    // button hapus keranjang 
    if (e.target.classList.contains('btn-keranjang')) {
        dialogDeleteAll()
    }
})

