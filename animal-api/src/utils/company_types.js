const companyTypes = [
	{
		type: 'agricultural-supplies',
		schema: 'SIGSVE',
		table: 'REGISTRO_EMPRESA_GIRO',
		column_id: 'NUME_REGI_EMP',
	},
	{
		type: 'agricultural-exporter',
		schema: 'SIGSA',
		table: 'SAC_ESTABLECIMIENTO_REGISTRO',
		column_id: 'CODIGO_ESTABLECIMIENTO',
	},
	{
		type: 'farm',
		schema: 'SIIMF',
		table: 'PREDIOS',
		column_id: 'CONCAT(CONCAT(PREDIOS.CODI_SEDE_SED, PREDIOS.CODI_PROD_MOS), CODI_PRED_MOS)',
	},
	{
		type: 'slaughterhouse',
		schema: 'SIGSA',
		table: 'CENTRO_BENEFICIO_PADRON',
		column_id: 'CODI_CBEN_CBE',
	},
	{
		type: 'cold_meat_stores',
		schema: 'SIGSA',
		table: 'CENTRO_BENEFICIO_PADRON',
		column_id: 'CODI_CBEN_CBE',
	},
	{
		type: 'rendering',
		schema: 'SIGSA',
		table: 'CENTRO_BENEFICIO_PADRON',
		column_id: 'CODI_CBEN_CBE',
	},
	{
		type: 'poultry_slaughter_center',
		schema: 'SIGSA',
		table: 'CENTRO_BENEFICIO_PADRON',
		column_id: 'CODI_CBEN_CBE',
	},
	{
		type: 'feed-processing',
		schema: 'SIGIA',
		table: 'PIE_SOL_SANITARIO_DATOS',
		column_id: 'SOLICITUD_ID',
	},
	{
		type: 'primary-processing',
		schema: 'SIGSVE',
		table: 'EAS_REGISTRO_SANITARIO',
		column_id: 'REGISTRO_ID',
	},
	{
		type: 'poultry-farm',
		schema: 'SIGSA',
		table: 'SANITARIO_FUNCIONAMIENTO',
		column_id: 'CSOLICITUD_FUNCIONAMIENTO',
	},
	{
		type: 'organic-certifier',
		schema: 'SICPO',
		table: 'PO_CERTIFICADOR_REGISTRO',
		column_id: 'REGISTRO_ID',
	},
	{
		type: 'livestock-supplies',
		schema: 'SIGSA',
		table: 'DIP_EMPRESAS_VETERINARIO',
		column_id: 'REGI_PADR_EMP',
	},
]