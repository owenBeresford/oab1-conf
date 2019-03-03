<?php

/**
 * PostgresDumper 
 * 
 * @package Iceline.config 
 * @author oab1 / Owen Beresford / owen@iceline.ltd.uk  
 * @license AGPL {@link http://www.gnu.org/licenses/agpl-3.0.html}
 */
abstract class PostgresSchemaDumper {
	protected $conn;
	protected $fieldBuffer;

	/**
	 * __construct ~ this eats a connection, to avoid lots of management on socket creation.
	 * 
	 * @param Resource $r ~ this is the type that the docs said, i think this needs testing 
	 * @param Stream $o ~ where to put the output SQL
	 * @return <self>
	 */
	function __construct(Resource $c, Stream $o) {
		$this->conn=$c;
		$this->fieldBuffer=[];
		$this->out=$o;
	}

	public static function simpleCreatePostgres(string $h, string $d, string $u, string $p):Resource {
		return pg_connect("host=$h dbname=$d user=$u password=$p" );
	}

// move tables with no foreign keys first
	public abstract function tableSort($in):array;

	public abstract function limitClause(string $table):string;


	private function read($sql):array {
		$res=pg_query($this->conn, $sql);
		$LENGTH =pg_num_rows($res);
		$i=0; $out=[]; 
		while( $i<$LENGTH) {
			$out[]=pg_fetch_array($res, $i, PGSQL_ASSOC );
			$i++;
		}
		return $out;
	}
	
	private function populateFields(string $table) {
		$schema=pg_meta_data($this->conn, $table);
		$this->fieldBuffer=array_keys($schema);	
	}

	private function listTables():array {
		$sql=<<<EOSQL
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema='public' ;
EOSQL;
		$aa=$this->read($sql);
		$aa=array_map(function($a) { return $a['table_name']; }, $aa);
		return $this->tableSort($aa);
	}
	
	private function generateSearchQuery(string $table):string {
		$where=$this->limitClause($table);
		if($where) {
			$sql="select ".implode(", ", $this->fieldBuffer)." from $table where $where";
		} else {
			$sql="select ".implode(", ", $this->fieldBuffer)." from $table ";
		}
		return $sql;
	}

	private function generateInsertSQL(string $table):string {
		return "\ninsert into $tables (".implode(", ", $this->fieldBuffer).") values ";
	}

	private function convertDataToValues(array $values):string {
		$sql="";
		while( $i<$LENGTH) {
			$rr=array_values($values[$i]);
			$rr=array_map(
				function($a) { 
					if(is_numeric($a)) { 
						return $a; 
					} else { 
						return "'".pg_escape_string($a)."'";
					 }
				 },
				 $rr);
			if($i>0) { $sql.=","; }

			$sql.="\n( ".implode(", ", $rr ) .")";
			$i++;
		}
		return $sql;
	}

	public function process() {
		$sql="";
		$tables=$this->listTables();
		foreach($tables as $v) {
			$this->populateFields($v);
			$aRS=$this->read($this->generateSearchQuery($v));

			$sql.=$this->generateInsertSQL($v )
				.$this->convertDataToValues($aRS)
				.";\n\n";
		}
		fwrite($this->out, $sql, strlen($sql));
// should I do a close here or not?
// as it was created outside of this scope, I err to not
	}
}


