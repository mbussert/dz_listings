$(document).ready(function () {
    $('#table_id').DataTable(
        {
            data: tags,
            searchPane: true
        }
    );
});