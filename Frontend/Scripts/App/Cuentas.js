angular.module('app').controller('CuentasController', ['$scope', '$http', '$uibModal', 'toastr', CuentasController]);
angular.module('app').controller('TransaccionesController', ['$scope', '$http', '$uibModal', 'toastr', TransaccionesController]);

function CuentasController($scope, $http, $uibModal, toastr) {
    var id_usuario = $("#id_usuario").val();

    var self = this;

    self.loading = false;
    self.id_usuario = id_usuario;


    self.data = {};
    self.data.cuentas = [];

    self.abrir_transaccion = abrir_transaccion;
    

    buscarCuentas();

    ///Accion para buscar cuentas
    function buscarCuentas() {
        self.loading = true;


        $http({
            url: 'http://localhost:65092/api/Operaciones/getCuentas',
            method: 'GET',
            params: { id_usuario: self.id_usuario}
        }).then(function (response) {

            self.data.cuentas = response.data;

            self.loading = false;
        }, function (error) {
            console.log(error);
            self.loading = false;
        });
    }

    //Accion para abrir el modal para nueva transaccion
    function abrir_transaccion(item) {

        //Consultamos catalogos de los dropdown
        $http.get('http://localhost:65092/api/Operaciones/getCatalogos?id_usuario=' + self.id_usuario + '&id_cuenta=' + item.id).then(function (response) {

            self.loading = false;

            var modal = $uibModal.open({
                templateUrl: 'ModalTransaccion.html',
                controller: ModalTransaccionCtrl,
                controllerAs: '$ctrl',
                size: 'lg',
                windowClass: 'app-modal-window',
                resolve: {
                    cuentas: function () {
                        return response.data.cuentas;
                    },
                    tipo_transaccion: function () {
                        return response.data.tipo_transaccion;
                    },
                    id_usuario: function () {
                        return self.id_usuario;
                    },
                    item: function () {
                        return item;
                    }

                }
            });

            modal.result.then(function (response) {
                if (response) {
                    buscarCuentas();

                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });

        }, function (error) {
            self.loading = false;
            console.log(error);
        });
    }


}

function TransaccionesController($scope, $http, $uibModal, toastr) {
    var id_usuario = $("#id_usuario").val();

    var self = this;

    self.loading = false;
    self.id_usuario = id_usuario;

    self.data = {};
    self.data.transacciones = [];

    buscarTransacciones();

    ///Accion para buscar transacciones
    function buscarTransacciones() {
        self.loading = true;


        $http({
            url: 'http://localhost:65092/api/Operaciones/getTransacciones',
            method: 'GET',
            params: { id_usuario: self.id_usuario }
        }).then(function (response) {

            self.data.transacciones = response.data;

            self.loading = false;
        }, function (error) {
            console.log(error);
            self.loading = false;
        });
    }


}

//Controladdor para el modal de una transaccion
var ModalTransaccionCtrl = function ($http, $uibModal, $uibModalInstance, cuentas, tipo_transaccion, id_usuario, item) {
    var self = this;

    self.id_usuario = id_usuario;
    self.cuentas = cuentas;
    self.tipo_transaccion = tipo_transaccion;
    self.item = item;

    self.changue_tipo = changue_tipo;
    self.show_cuenta_destino = false;
    self.guardar_transaccion = guardar_transaccion;

    self.transaccion = {};
    self.transaccion.monto = 0;
    self.transaccion.id_cuenta = item.id;
    self.transaccion.id_usuario = id_usuario;
    self.transaccion.id_tipo_transaccion = self.tipo_transaccion[0].id.toString();
    self.transaccion.id_cuenta_destino = self.cuentas[0].id.toString();


    //Funcion para obtener el tipo de transacion y saber si pide o no cuenta destino
    function changue_tipo() {
        var tipo_sel = self.tipo_transaccion.filter(function (fl) {
            return fl.id == self.transaccion.id_tipo_transaccion;
        });

        var tipo = tipo_sel[0];

        if (tipo.pide_cuenta_destino) {
            self.show_cuenta_destino = true;
            self.transaccion.id_cuenta_destino = self.cuentas[0].id.toString();
        }
        else {
            self.show_cuenta_destino = false;
            self.transaccion.id_cuenta_destino = null;
        }

        console.log(tipo);
    }

    function guardar_transaccion() {

        if (self.transaccion.monto <= 0) {
            alert("Por favor Ingrese un monto mayor a cero.");
            return false;
        }

        if (self.transaccion.monto > self.item.saldo) {
            alert("Por favor Ingrese un monto menor al saldo total de la cuenta.");
            return false;
        }

        console.log(self.transaccion)

        $http.get('http://localhost:65092/api/Operaciones/guardar_transaccion?id_cuenta=' + self.transaccion.id_cuenta + '&id_cuenta_destino=' + self.transaccion.id_cuenta_destino + '&id_tipo_transaccion=' + self.transaccion.id_tipo_transaccion + '&id_usuario=' + self.transaccion.id_usuario + '&monto=' + self.transaccion.monto).then(function (response) {

            self.loading = false;
            console.log(response);
            if (response.data.guardar_tran == 0) {
                alert('La transaccion se ha realizado correctamente');
                $uibModalInstance.close(true);
            }
            else {
                alert('Error al realizar result: +' + response.data.error, 'Error');
                $uibModalInstance.close(false);
            }

        }, function (error) {
            alert("Ha ocurrido un error al crear la transaccion, por favor contacte su administrador");
            console.log(error);
            self.loading = false;
        });
    }
}