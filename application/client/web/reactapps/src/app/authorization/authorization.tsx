import './authorization.scss';
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState } from 'react';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {FormControl, FormLabel } from 'react-bootstrap';
import { AuthorizationService ,GpUpdate,GpGetNounById,GpDelete,GpCreate,GpGetAllValues} from './authorization.service';

const Authorization = (props: any) => {
    let resources: any = {
        created_date: '',
        created_by: '',
        last_modified_by: '',
        last_modified_date: '',
        resource_name: '',
        roles: [],
        components: [],
    };
    // const columnDefs: any;
    // var rowData: any="";
    let deleteById: any = "";
    var rowdata1: any;
    // const allRowData: any;
    var gridApi: any;
    // const gridColumnApi: any;
    // params: any;
    // btnClickedHandler: any;
    // defaultColDef: { editable: boolean; sortable: boolean; filter: boolean; };
    const colDefs: any = [
        { headerName: 'Screen_Name', field: 'resource_name', flex: 1 },
        { headerName: 'Roles', field: 'roles', flex: 1 },]
    const rowData :any= [
        { resource_name: "Toyota", roles: "Celica" },
        { resource_name: "Ford", roles: "Mondeo" },
        { resource_name: "Porsche", roles: "Boxter" },
        { resource_name: "Rolls", roles: "Boxter" },
        { resource_name: "Royce", roles: "Boxter" }


    ];
    
    const [columnDefs] = useState([
        {
            field: 'resources_name',
            headerName: 'Component_field',
            width: 250,
        },
        {
            field: 'roles',
            headerName: 'Roles',
            width: 450,
        },
        {
            headerName: 'Action',
            width: 100,
            cellRenderer: 'buttonRenderer',
            editable: false,
            sortable: false,
            filter: false,

        }
    ])

    const paginationPageSize: any = 10;
    const page: any = 1; 
    let getAllRowData: any[] = [];
    // const myForm: FormGroup | any = ""
    const roles = ["admin", "user", "guest", "developer"];
    const selected: any[] = [];


    //  const onGridReady = () => console.log('The grid is now ready')
     useEffect(() => {
        resources.created_by = sessionStorage.getItem('email');
        GetAllValues();
       // GpUpdate();
   }, [])
    

    const gridOptions = {
        rowSelection: 'multiple',
        groupSelectsChildren: true,
        groupSelectsFiltered: true,
        suppressAggFuncInHeader: true,
        suppressRowClickSelection: true,
        pagination: true,
        autoGroupColumnDef: {
            headerName: "Roles", field: "roles", width: 200,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                checkbox: true
            }
        },
        getNodeChildDetails: (rowItem: any) => {
            console.log("check with", rowItem);
            if (rowItem.participants) {
                return {
                    group: true,
                    // open C be default
                    expanded: rowItem.group === 'Group C',
                    // provide ag-Grid with the children of this group
                    children: rowItem.participants,
                    // the key is used by the default group cellRenderer
                    key: rowItem.group
                };
            } else {
                return null;
            }
        },
       onGridReady(params: any){

       }   
    }
    const Update = () => {
        console.log('get an update', { resources });
       GpUpdate({resources}).then((data: any) => {
            resources.name = '';
            resources.description = '';
            resources.itemtag = [];
        },
            (error: Error) => {
                console.log('Error', error);
            });
    }
    const Delete = (e: any) => {
        const rows = e.rowData;
        const selectedData = [
            rows
        ];
        const res = gridApi.updateRowData({ remove: selectedData });
        console.log('delete a data', rows);
        let deleteData = rows._id;
        console.log('get an delete', { resources }, { deleteById });
        GpDelete(deleteData).then((data: any) => {
            resources.name = '';
            resources.description = '';
            resources.itemtag = [];
        },
            (error: Error) => {
                console.log('Error', error);
            });
    }

    const onCellValueChanged = (e: any) => {
        const rowIndex = e.rowIndex;
        const currentEntity: any = [];
        gridApi.forEachNode(function (node: { data: { name: any; }; }, nodIndex: any) {
            if (nodIndex !== rowIndex) {
                currentEntity.push(node.data.name);
            }
        });
    }

    const removeRow = (e: any) => {
        const rows = e.rowData;
        const selectedData = [
            rows
        ];
        const res = gridApi.updateRowData({ remove: selectedData });
    }

    const Create = () => {
        gridApi.forEachNode((node: { data: any; }) => rowdata1.push(node.data));
        console.log('row data', rowdata1);
        resources.component = rowdata1;
        resources.roles = selected;
        console.log('final', resources);
       GpCreate(resources).then((data: any) => {
            resources.resource_name = '';
            resources.roles = [];
            resources.component = [];
            // rowData = [];

        },
            (error: any) => {
                console.log('Error', error);
            });
    }
    const onRowClick = (event: any) => {
        console.log(event.rowIndex);
        let Indexdata = rowData[event.rowIndex];
        console.log("Hi",Indexdata)
        GpRoute(Indexdata._id);
        console.log(Indexdata._id);
    }

    const onGridReady = (params: any) => {
        gridApi = params.api;
        gridApi.sizeColumnsToFit();
        const gridColumnApi = params.columnApi;
    }

    const AddRows = () => {
        const rowta = {};
        gridApi.addItems([rowta]);
        gridApi.refreshView();

    }
    const onDeleteRow = () => {
        const selectedData = gridApi.getSelectedRows();
        gridApi.updateRowData({ remove: selectedData });
    }
    const GetAllValues = () => {
      
        GpGetAllValues().then((data: any) => {
            getAllRowData = data;
            console.log('getalldata', getAllRowData);
        },
            (error: any) => {
                console.log('Error', error);
            });
    }

    const onSelectionChanged = (values: any) => {
        console.log('getbyid', values._id);
        deleteById = values._id;
        GpRoute(values._id);
    }

    const GpRoute = (queryId: any) => {
        console.log('update data', queryId);
    }


    return (
        <>
            <h2 className="screen-align">Authorization</h2>
            <section id="iwlt8m" className="gpd-section" >
                <div className='ag-style'>
                    <div style={{ height: 400, "width": "auto" }}>
                        <AgGridReact className="ag-theme-alpine-dark"
                           onRowClicked={onRowClick}
                           onGridReady={onGridReady}
                           gridOptions={gridOptions}
                           domLayout='autoHeight'
                            rowData={rowData}
                            columnDefs={colDefs}>
                        </AgGridReact>
                    </div>
                </div>
            </section >

        </>
    )
}

export default Authorization;

