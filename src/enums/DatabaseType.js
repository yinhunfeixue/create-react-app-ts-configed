class DatabaseType {}

DatabaseType.HIVE = 'HIVE'
DatabaseType.MYSQL = 'MYSQL'
DatabaseType.SQLSERVER = 'SQLServer'
DatabaseType.DB2 = 'DB2'
DatabaseType.ORACLE = 'ORACLE'

DatabaseType.ALL = [
    DatabaseType.HIVE,
    DatabaseType.MYSQL,
    DatabaseType.SQLSERVER,
    DatabaseType.DB2,
    DatabaseType.ORACLE
]

DatabaseType.toString = (value) => {
    switch (value) {
        case DatabaseType.HIVE:
            return 'Hive'
        case DatabaseType.MYSQL:
            return 'MySQL'
        case DatabaseType.SQLSERVER:
            return 'SQLServer'
        case DatabaseType.DB2:
            return 'DB2'
        case DatabaseType.ORACLE:
            return 'Oracle'
        default:
            return ''
    }
}

export default DatabaseType
