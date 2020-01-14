<?php

define('NB_PAR_PAGE', 20);

$bdd = new mysqli('localhost', 'root', '', 'BasesCC');
if ($bdd->connect_error) die("Connexion impossible");

if (isset($_GET['recherche'])) {
  rechercherProjet($_GET);
} else if (isset($_GET['id'])) {
  rechercherDetail($_GET['id']);
}

function rechercherProjet($criteres) {
  global $bdd;
  $where = whereProjet($criteres);
  $sql = "select * from projet_universite $where order by projet, universite, nom";
  $rec = $bdd->query($sql) or die($bdd->error);
  $total = $rec->num_rows;
  $page = isset($criteres['page']) ? addslashes($criteres['page']) : 1;
  $limit = "limit " . ($page-1)*NB_PAR_PAGE . ', ' . NB_PAR_PAGE;
  $sql .= " $limit";
  $rec = $bdd->query($sql) or die($bdd->error);
  $res = array();
  header('Content-type: text/xml; charset=UTF-8');
  echo("<projets_universite>");
  echo("<nombre_total>$total</nombre_total>");
  echo("<liste>");
  $index = ($page-1)*NB_PAR_PAGE;
  while ($row=$rec->fetch_object()) {
    $index++;
    echo("<projet id=\"$row->id\">");
    echo("<index>$index</index>");
    echo("<nom>$row->projet</nom>");
    echo("<universite>$row->universite</universite>");
    echo("<vote>$row->vote</vote>");
    echo("<responsable_nom>$row->nom</responsable_nom>");
    echo("<responsable_prenom>$row->prenom</responsable_prenom>");
    echo("<email>$row->email</email>");
    echo("</projet>");
  }
  echo("</liste>");
  echo("</projets_universite>");
}

function whereProjet($criteres) {
  $clauseWhere = array();
  if (isset($criteres['projet'])) {
    $critere = addslashes($criteres['projet']);
    $clauseWhere[] = "projet like '$critere%'";
  }
  if (isset($criteres['universite'])) {
    $critere = addslashes($criteres['universite']);
    $clauseWhere[] = "universite like '$critere%'";
  }
  if (isset($criteres['vote']) and ($criteres['vote']>'0')) {
    $critere = addslashes($criteres['vote']);
    $clauseWhere[] = "vote>='$critere'";
  }
  if (count($clauseWhere)>0) {
    return "where " . implode(' AND ', $clauseWhere);
  }
}

function rechercherDetail($id) {
  global $bdd;
  $id = addslashes($id);
  $sql = "select * from projet_universite where id=$id";
  $rec = $bdd->query($sql) or die($bdd->error);
  if ($row=$rec->fetch_object()) {
    echo(json_encode($row));
  }
}
