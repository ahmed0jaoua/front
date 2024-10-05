<?php

namespace App\Entity;

use App\Repository\SiteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Ignore;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
class Site
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

  

    #[ORM\Column(length: 255,nullable: true)]
    private ?string $code = null;

    #[ORM\Column(length: 255,nullable: true)]
    private ?string $telephone = null;

    #[ORM\Column(length: 255,nullable: true)]
    private ?string $nom = null;


    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresse = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    private ?Societe $societe = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    private ?Pays $pays = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    private ?Ville $ville = null;
     /** 
      * @var Collection<int, SiteUtilisateur>
     */
    #[Ignore]
    #[ORM\OneToMany(targetEntity: SiteUtilisateur::class, mappedBy: 'site')]
    private Collection $siteUtilisateurs;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siteWeb = null;

    public function __construct()
    {
        $this->siteUtilisateurs = new ArrayCollection();
    }  
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

  

    

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getSociete(): ?Societe
    {
        return $this->societe;
    }

    public function setSociete(?Societe $societe): static
    {
        $this->societe = $societe;

        return $this;
    }

    public function getPays(): ?Pays
    {
        return $this->pays;
    }

    public function setPays(?Pays $pays): static
    {
        $this->pays = $pays;

        return $this;
    }

    public function getVille(): ?Ville
    {
        return $this->ville;
    }

    public function setVille(?Ville $ville): static
    {
        $this->ville = $ville;

        return $this;
    }



    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    
    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): static
    {
        $this->code = $code;

        return $this;
    }
	
	
	 /**
     * @return Collection<int, SiteUtilisateur>
     */
    public function getSiteUtilisateurs(): Collection
    {
        return $this->siteUtilisateurs;
    }

    public function addSiteUtilisateur(SiteUtilisateur $siteUtilisateur): static
    {
        if (!$this->siteUtilisateurs->contains($siteUtilisateur)) {
            $this->siteUtilisateurs->add($siteUtilisateur);
            $siteUtilisateur->setSite($this);
        }

        return $this;
    }

    public function removeSiteUtilisateur(SiteUtilisateur $siteUtilisateur): static
    {
        if ($this->siteUtilisateurs->removeElement($siteUtilisateur)) {
            // set the owning side to null (unless already changed)
            if ($siteUtilisateur->getSite() === $this) {
                $siteUtilisateur->setSite(null);
            }
        }

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getSiteWeb(): ?string
    {
        return $this->siteWeb;
    }

    public function setSiteWeb(?string $siteWeb): static
    {
        $this->siteWeb = $siteWeb;

        return $this;
    }

}
