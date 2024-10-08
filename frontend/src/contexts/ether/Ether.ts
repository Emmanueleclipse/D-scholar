import { ethers } from "ethers";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import {
  Paper__factory,
  PeerReview,
  PeerReview__factory,
  User,
  User__factory,
} from "../../typechain";
export default class Ether {
  async addReview(status: boolean, comment: string, address: string) {
    const c = this.getPaperContract(address);
    console.log(address);
    console.log(status, comment);
    const tx = await c.addReview(status, comment);
    await tx.wait();
    return tx;
  }

  getPaperReviews(address: string) {
    const c = this.getPaperContract(address);
    return c.getReviews();
  }

  private provider: ethers.providers.Web3Provider;
  private client: IPFSHTTPClient;
  private user!: User;
  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    const auth =
      "Basic " +
      btoa(
        "2QOAJ57mdBgovvtJzDAbhhn2Gwh" + ":" + "9650bbc82880dfd9fbfe7b0a8892ef6d"
      );
    this.client = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: { authorization: auth },
    });
  }

  async connectWallet() {
    await this.provider.send("eth_requestAccounts", []);
    const signer = this.provider.getSigner();
    return await signer.getAddress();
  }

  async signMessage(message: string) {
    const signer = this.provider.getSigner();
    return await signer.signMessage(message);
  }

  async createUser(scholarUrl: string) {
    const c = await this.getPeerReviewContract();
    const tx = await c.createUser(scholarUrl);
    await tx.wait();
    return this.getMyUser();
  }

  async getMyUser() {
    const c = await this.getPeerReviewContract();
    const address = await c.getMyUser();

    if (address === "0x0000000000000000000000000000000000000000") {
      return null;
    }

    const user = await this.getUserContract(address);

    return user;
  }

  async setMyUser(user: User) {
    this.user = user;
  }

  async getPapers() {
    const addresses = await this.user.getPapers();
    console.log("addresses", addresses);
    const papers = await Promise.all(
      addresses.map((address) => {
        return this.getPaperContract(address);
      })
    );

    console.log("Papers deployed for this user:");
    papers.forEach(async (paper) => {
      console.log(
        `Address: ${paper.address} IPFS Hash: ${await paper.ipfsHash()}`
      );
    });
    return papers;
  }

  async deployPaper(ipfsHash: string) {
    const t = await this.user.deployPaper(ipfsHash);
    await t.wait();
    return t;
  }

  async getUsers() {
    const c = await this.getPeerReviewContract();
    console.log(await c.getUsers());
  }

  private getPeerReviewContract() {
    const signer = this.provider.getSigner();
    const peerReview = PeerReview__factory.connect(
      process.env.REACT_APP_PEER_REVIEW_CONTRACT_ADDRESS as string,
      signer
    );
    return peerReview;
  }

  private getPaperContract(address: string) {
    const signer = this.provider.getSigner();
    const paper = Paper__factory.connect(address, signer);
    return paper;
  }

  private getUserContract(address: string) {
    const signer = this.provider.getSigner();
    const user = User__factory.connect(address, signer);
    return user;
  }

  async add(file: any, progressFn: (progress: number) => void) {
    const added = await this.client.add(file, {
      progress: (prog) => console.log(progressFn((prog / file.size) * 100)),
    });
    return added.path;
  }
}
