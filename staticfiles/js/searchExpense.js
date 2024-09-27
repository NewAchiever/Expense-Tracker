const searchField = document.querySelector('#searchField');
const tableOutput = document.querySelector('.table-output');
const appTable = document.querySelector('.app-table');
const pagination = document.querySelector('.pagination-container');
const tbody = document.querySelector('.table-body');
searchField.addEventListener('keyup', (e) => {
    const searchValue = e.target.value;
    if(searchValue.trim().length > 0){
        //console.log('searchValue', searchValue)
        console.log('json', JSON.stringify({searchText: searchValue}))
        tbody.innerHTML = ""
        fetch("search-expenses/",{
            body: JSON.stringify({searchText: searchValue}),
            method: "POST",
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            appTable.style.display = "none";
            tableOutput.style.display = "block";
            if(data.length === 0){
                tableOutput.innerHTML = 'No results found';
                pagination.style.display = "none";
            }
            else{
                data.forEach((item) => {
                    tbody.innerHTML += `
                    <tr>
                        <td>${item.amount}</td>
                        <td>${item.category}</td>
                        <td>${item.description}</td>
                        <td>${item.date}</td>
                    </tr>`;
                });
            }
        });
    }
    else{
        appTable.style.display = "block";
        pagination.style.display = "block";
        tableOutput.style.display = "none";
    }
})