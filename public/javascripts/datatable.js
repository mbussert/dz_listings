$(document).ready(function () {
    $.getJSON("/listings/get_tags", function (result) {
        // result.tags = result.tags.map(arr => { return {col1: arr[0], col2: arr[1], col3: arr[2]}})
        $('#table_id').DataTable(
            {
                data: result.tags,
                searchPane: true,
                threshold: 0,
                // columns: [ 'col1', 'col2', 'col3' ]
            }
        );
    });
});

