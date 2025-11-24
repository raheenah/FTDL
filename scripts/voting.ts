import { network } from "hardhat";
import { parseEther } from "viem";

async function main() {
  // Connect using Hardhat's viem plugin
  const { viem } = await network.connect({
    network: "hardhatMainnet",
    chainType: "l1",
  });

  // 1. Deploy the VotingContract
  console.log("\nDeploying contract...");

  const voting = await viem.deployContract("VotingContract", [86400n]); 
  // console.log("VotingContract deployed at:", voting.address);

  const accounts = await viem.getWalletClients();
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  // 2. Register candidates
  // console.log("\nRegistering candidates...");

  await voting.write.registerCandidate(["Tolu"]);
  await voting.write.registerCandidate(["Bisi"]);

  const candidate1 = await voting.read.candidates([1n]);
  const candidate2 = await voting.read.candidates([2n]);

  console.log("Candidate 1:", candidate1);
  console.log("Candidate 2:", candidate2);

  // 3. Register voters
  console.log("\nRegistering voters...");

await voting.write.registerAVoter({
  account: voter1.account,
});

await voting.write.registerAVoter({
  account: voter2.account,
});


  // 4. Cast votes
  console.log("\nCasting votes...");

  await voting.write.voteForACandidate([1n], { account: voter1.account });
  await voting.write.voteForACandidate([1n], { account: voter2.account });

  const vote1 = await voting.read.votesByCandidate([voter1.account.address]);
  const vote2 = await voting.read.votesByCandidate([voter2.account.address]);

  console.log("Voter 1 vote:", vote1);
  console.log("Voter 2 vote:", vote2);

  // 5. Determine winner
  console.log("\nGetting winner...");

  const winner = await voting.read.getCandidateWithHighestVote();
  console.log("Winner:", winner, {
    id: winner.id.toString(),
    name: winner.name,
    votes: winner.score.toString(),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
