$(document).ready(function () {
    $('#table_id').DataTable(
        {
            data: tags,
            searchPane: true,
            threshold: 0.2
        }
    );
});